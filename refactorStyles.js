const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    if (fs.statSync(dirFile).isDirectory()) {
      filelist = walkSync(dirFile, filelist);
    } else {
      if (dirFile.endsWith('.js') && !dirFile.includes('Login.js') && !dirFile.includes('App.js') && !dirFile.includes('Navbar.js')) {
        filelist.push(dirFile);
      }
    }
  });
  return filelist;
};

const replaceStyles = (content) => {
  // Common Light Theme Replacements -> Dark Theme / Glassmorphism
  let newContent = content;

  // Background replacements
  newContent = newContent.replace(/background: "linear-gradient\([^)]+\)"/g, 'background: "transparent"');
  newContent = newContent.replace(/background: "rgba\(255, 255, 255, 0\.95\)"/g, 'background: "rgba(24, 24, 27, 0.4)"');
  newContent = newContent.replace(/background: "rgba\(255, 255, 255, 0\.8\)"/g, 'background: "rgba(255, 255, 255, 0.05)"');
  newContent = newContent.replace(/background: "rgba\(255, 255, 255, 0\.85\)"/g, 'background: "rgba(255, 255, 255, 0.05)"');
  newContent = newContent.replace(/background: "white"/g, 'background: "rgba(24, 24, 27, 0.4)"');
  newContent = newContent.replace(/background: '#fff'/g, 'background: "rgba(24, 24, 27, 0.4)"');
  newContent = newContent.replace(/background: "#fff"/g, 'background: "rgba(24, 24, 27, 0.4)"');
  
  // Specific Sidebar/Page overrides
  newContent = newContent.replace(/background: "linear-gradient\(135deg, #f5f7fa 0%, #c3cfe2 100%\)"/g, 'background: "transparent"');
  newContent = newContent.replace(/background: "linear-gradient\(135deg, #f0f4ff 0%, #e8f0ff 100%\)"/g, 'background: "transparent"');
  
  // Backgrounds with specific color blocks (e.g. AddEmployee, Lists)
  newContent = newContent.replace(/backgroundColor: "#f5f7fa"/gi, 'backgroundColor: "transparent"');
  
  // Text Colors
  newContent = newContent.replace(/color: "#333"/g, 'color: "#fff"');
  newContent = newContent.replace(/color: "#666"/g, 'color: "rgba(255, 255, 255, 0.7)"');
  newContent = newContent.replace(/color: "#999"/g, 'color: "rgba(255, 255, 255, 0.5)"');
  newContent = newContent.replace(/color: '#333'/g, 'color: "#fff"');
  newContent = newContent.replace(/color: '#666'/g, 'color: "rgba(255, 255, 255, 0.7)"');

  // Input Focus Colors / Light Theme Dropdowns
  newContent = newContent.replace(/background: "rgba\(255, 255, 255, 0\.95\)"/g, 'background: "rgba(0, 0, 0, 0.4)"');

  // Specific for Sidebar
  newContent = newContent.replace(/border: "1px solid rgba\(102, 126, 234, 0\.15\)"/g, 'border: "1px solid rgba(255, 255, 255, 0.1)"');
  newContent = newContent.replace(/border: "1px solid rgba\(102, 126, 234, 0\.1\)"/g, 'border: "1px solid rgba(255, 255, 255, 0.05)"');
  newContent = newContent.replace(/borderRight: "1px solid rgba\(102, 126, 234, 0\.15\)"/g, 'borderRight: "1px solid rgba(255, 255, 255, 0.1)"');

  return newContent;
};

const files = walkSync(path.join(__dirname, 'src', 'pages'));
files.push(path.join(__dirname, 'src', 'components', 'Sidebar', 'Sidebar.js'));
files.push(path.join(__dirname, 'src', 'components', 'Dashboard', 'StatCard.js')); // If exists

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    let updated = replaceStyles(content);
    if (content !== updated) {
      fs.writeFileSync(file, updated);
      console.log('Updated:', file);
    }
  }
});
