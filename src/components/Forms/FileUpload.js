import { ref,uploadBytes } from "firebase/storage";
import { storage } from "../../firebase/firebaseConfig";

function FileUpload(){

const upload = async(e)=>{

const file = e.target.files[0];

const fileRef = ref(storage,"documents/"+file.name);

await uploadBytes(fileRef,file);

alert("Uploaded");

};

return(

<div>

<h3>Upload Document</h3>

<input type="file" onChange={upload}/>

</div>

);

}

export default FileUpload;