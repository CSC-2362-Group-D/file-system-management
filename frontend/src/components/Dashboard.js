import React from 'react';

import { FaDownload, FaTrash } from 'react-icons/fa';

function Dashboard() {
  // Temporary data for file listings
  const files = [
    { name: 'Report.pdf', link: '/downloads/report.pdf' },
    { name: 'Invoice.docx', link: '/downloads/invoice.docx' }
  ];

  // Function to handle file upload, to be implemented
  const handleFileUpload = (event) => {
    console.log(event.target.files);
    // Process the file...
  };

  // Function to handle file download, to be implemented
  const handleFileDownload = (fileName) => {
    console.log(`Downloading ${fileName}`);
    // Process the download...
  };

  // Function to handle file delete, to be implemented
  const handleFileDelete = (fileName) => {
    console.log(`Deleting ${fileName}`);
    // Process the deletion...
  };

  return (
    <div style={styles.container}>
    <h1 style={styles.title}>File Management Dashboard</h1>
    <h4> Upload:
    <input 
      type="file" 
      
      onChange={handleFileUpload} 
      style={styles.uploadInput}
      
    /></h4>
    <table style={styles.table}>
      <thead>
        <tr>
          <th style={styles.fileNameHeader}>File Name</th>
          <th style={styles.iconHeader}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {files.map((file, index) => (
          <tr key={index} style={styles.tableRow}>
            <td style={styles.fileName}>{file.name}</td>
            <td style={styles.iconCell}>
              <FaDownload 
                style={{ ...styles.icon, ...styles.downloadIcon }}
                onClick={() => handleFileDownload(file.name)}
              />
              <FaTrash 
                style={{ ...styles.icon, ...styles.deleteIcon }}
                onClick={() => handleFileDelete(file.name)}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
}

export default Dashboard;

// You can continue to use the styles object from your Login component
// and just add/adjust styles specific to the Dashboard.
const styles = {
  // ... (reuse styles from your Login component here)
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#121212', // Dark background color
    color: '#0ff', // Bright cyber color for text
  },
  title: {
    marginBottom: '2rem',
    fontSize: '2.5rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
  },
  input: {
    padding: 10,
    marginLeft: 8,
    fontSize: '1rem',
    color: '#fff', // White color for input text
    backgroundColor: '#333', // Darker background for inputs
    border: '1px solid #444',
    borderRadius: '4px',
    width: '250px', // Fixed width, could be responsive
  },
  submitButton: {
    padding: '10px 20px',
    fontSize: '1rem',
    color: '#121212', // Dark text for contrast
    backgroundColor: '#0ff', // Bright cyber color for buttons
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
  },
  uploadInput: {
    margin: '0px 10px',
    padding: '10px',
    fontSize: '1rem',
    color: '#fff',
    backgroundColor: '#333',
    border: '1px solid #444',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  table: {
    width: '80%',
    marginTop: '20px',
    alignItems: 'center',
    borderCollapse: 'collapse',
    color: '#fff'
  },
  tableRow: {
    backgroundColor: '#333',
    borderBottom: '1px solid #444'
  },
  button: {
    padding: '5px 15px',
    fontSize: '0.8rem',
    color: '#121212',
    backgroundColor: '#0ff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
    margin: '5px'
  },
  fileNameHeader: {
    textAlign: 'left',
    width: '70%',
  },
  iconHeader: {
    textAlign: 'right',
    paddingRight: '1rem',
    width: '30%',
  },
  fileName: {
    // Adjust styling for file name column
    padding: '10px',
    textAlign: 'left',
  },
  iconCell: {
    // Adjust styling for icon buttons column
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '20px', // Space out icons
    padding: '10px',
  },
  icon: {
    cursor: 'pointer',
    transition: 'color 0.2s',
    // Adjust icon size as necessary, maybe smaller for the table layout
    fontSize: '1.2rem',
  },
  downloadIcon: {
    color: '#0ff', // Style color for download icon
    // More styles specific to the download icon
  },
  deleteIcon: {
    color: '#0ff', // Style color for delete icon
    // More styles specific to the delete icon
  },
};
