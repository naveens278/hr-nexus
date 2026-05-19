import {
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db, storage } from "./firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Add job posting
export const addJobPosting = async (jobData) => {
  try {
    const docRef = await addDoc(collection(db, "recruitment/jobs/postings"), {
      ...jobData,
      status: "open",
      postedDate: new Date().toISOString(),
      createdAt: Timestamp.now(),
    });

    return { id: docRef.id, success: true, message: "Job posted successfully" };
  } catch (error) {
    console.error("Add Job Posting Error:", error);
    return { error: error.message, success: false };
  }
};

// Get all job postings
export const getJobPostings = async (status = null) => {
  try {
    let q;
    if (status) {
      q = query(
        collection(db, "recruitment/jobs/postings"),
        where("status", "==", status),
        orderBy("postedDate", "desc")
      );
    } else {
      q = query(
        collection(db, "recruitment/jobs/postings"),
        orderBy("postedDate", "desc")
      );
    }

    const querySnapshot = await getDocs(q);
    const jobs = [];

    querySnapshot.forEach((doc) => {
      jobs.push({ id: doc.id, ...doc.data() });
    });

    return jobs;
  } catch (error) {
    console.error("Get Job Postings Error:", error);
    return [];
  }
};

// Get job posting by ID
export const getJobPostingById = async (jobId) => {
  try {
    const docRef = doc(db, "recruitment/jobs/postings", jobId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        data: { id: docSnap.id, ...docSnap.data() },
        success: true,
      };
    } else {
      return { error: "Job posting not found", success: false };
    }
  } catch (error) {
    console.error("Get Job Posting Error:", error);
    return { error: error.message, success: false };
  }
};

// Update job posting
export const updateJobPosting = async (jobId, updates) => {
  try {
    await updateDoc(doc(db, "recruitment/jobs/postings", jobId), {
      ...updates,
      updatedAt: Timestamp.now(),
    });

    return { success: true, message: "Job posting updated successfully" };
  } catch (error) {
    console.error("Update Job Posting Error:", error);
    return { error: error.message, success: false };
  }
};

// Close job posting
export const closeJobPosting = async (jobId) => {
  try {
    await updateDoc(doc(db, "recruitment/jobs/postings", jobId), {
      status: "closed",
      closedDate: new Date().toISOString(),
    });

    return { success: true, message: "Job posting closed" };
  } catch (error) {
    console.error("Close Job Posting Error:", error);
    return { error: error.message, success: false };
  }
};

// Add applicant
export const addApplicant = async (jobId, applicantData, resumeFile) => {
  try {
    let resumeURL = null;

    // Upload resume if provided
    if (resumeFile) {
      const storageRef = ref(
        storage,
        `recruitment/resumes/${jobId}/${applicantData.email}_${Date.now()}`
      );
      await uploadBytes(storageRef, resumeFile);
      resumeURL = await getDownloadURL(storageRef);
    }

    const docRef = await addDoc(collection(db, "recruitment/applicants/applications"), {
      jobId,
      ...applicantData,
      resume: resumeURL,
      status: "applied",
      appliedDate: new Date().toISOString(),
      createdAt: Timestamp.now(),
    });

    return { id: docRef.id, success: true, message: "Application submitted successfully" };
  } catch (error) {
    console.error("Add Applicant Error:", error);
    return { error: error.message, success: false };
  }
};

// Get applicants for job
export const getApplicantsForJob = async (jobId) => {
  try {
    const q = query(
      collection(db, "recruitment/applicants/applications"),
      where("jobId", "==", jobId),
      orderBy("appliedDate", "desc")
    );

    const querySnapshot = await getDocs(q);
    const applicants = [];

    querySnapshot.forEach((doc) => {
      applicants.push({ id: doc.id, ...doc.data() });
    });

    return applicants;
  } catch (error) {
    console.error("Get Applicants Error:", error);
    return [];
  }
};

// Update applicant status
export const updateApplicantStatus = async (applicantId, status, notes = "") => {
  try {
    const updates = {
      status,
      updatedAt: Timestamp.now(),
    };

    if (notes) {
      updates.notes = notes;
    }

    if (status === "shortlisted") {
      updates.shortlistDate = Timestamp.now();
    } else if (status === "rejected") {
      updates.rejectionDate = Timestamp.now();
    } else if (status === "offered") {
      updates.offerDate = Timestamp.now();
    }

    await updateDoc(doc(db, "recruitment/applicants/applications", applicantId), updates);

    return { success: true, message: "Applicant status updated successfully" };
  } catch (error) {
    console.error("Update Applicant Status Error:", error);
    return { error: error.message, success: false };
  }
};

// Schedule interview
export const scheduleInterview = async (applicantId, interviewData) => {
  try {
    const docRef = await addDoc(collection(db, "recruitment/interviews/scheduled"), {
      applicantId,
      ...interviewData,
      status: "scheduled",
      createdAt: Timestamp.now(),
    });

    // Update applicant status
    await updateApplicantStatus(applicantId, "interview");

    return { id: docRef.id, success: true, message: "Interview scheduled successfully" };
  } catch (error) {
    console.error("Schedule Interview Error:", error);
    return { error: error.message, success: false };
  }
};

// Get scheduled interviews
export const getScheduledInterviews = async (status = null) => {
  try {
    let q;
    if (status) {
      q = query(
        collection(db, "recruitment/interviews/scheduled"),
        where("status", "==", status),
        orderBy("interviewDate", "asc")
      );
    } else {
      q = query(
        collection(db, "recruitment/interviews/scheduled"),
        orderBy("interviewDate", "asc")
      );
    }

    const querySnapshot = await getDocs(q);
    const interviews = [];

    querySnapshot.forEach((doc) => {
      interviews.push({ id: doc.id, ...doc.data() });
    });

    return interviews;
  } catch (error) {
    console.error("Get Scheduled Interviews Error:", error);
    return [];
  }
};

// Update interview result
export const updateInterviewResult = async (interviewId, result, feedback) => {
  try {
    await updateDoc(doc(db, "recruitment/interviews/scheduled", interviewId), {
      result,
      feedback,
      completedAt: Timestamp.now(),
      status: "completed",
    });

    return { success: true, message: "Interview result recorded" };
  } catch (error) {
    console.error("Update Interview Result Error:", error);
    return { error: error.message, success: false };
  }
};

// Get recruitment pipeline stats
export const getRecruitmentStats = async () => {
  try {
    const jobs = await getJobPostings();
    const activeJobs = jobs.filter((j) => j.status === "open").length;

    return {
      data: {
        totalJobPostings: jobs.length,
        openJobPostings: activeJobs,
      },
      success: true,
    };
  } catch (error) {
    console.error("Get Recruitment Stats Error:", error);
    return { error: error.message, success: false };
  }
};
