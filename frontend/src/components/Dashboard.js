import React, { useState, useEffect } from 'react';
//import jwtDecode from 'jwt-decode';
import { jwtDecode } from "jwt-decode";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaDownload, FaTrash, FaEye, FaSignOutAlt  } from 'react-icons/fa';
//import { useEffect } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";

function Dashboard() {
  // Temporary data for file listings
  const [files, setFiles] = React.useState([]);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [viewingFileContent, setViewingFileContent] = React.useState('');
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = React.useState(null);
  const [userRoles, setUserRoles] = useState([]);
  const [activeTab, setActiveTab] = useState('personal'); // 'personal' or 'shared'
  const [sharedFiles, setSharedFiles] = useState([]);
  const [tabIndex, setTabIndex] = useState(0);
  const [fileToView, setFileToView] = useState(null);
  useEffect(() => { 
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      setUserRoles(decodedToken.roles || []);
    }
  }, []);
  
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };
  
  const handleLogout = async () => {
    try {
      await axios.post('https://localhost:3001/api/logout', {}, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      console.log('Logged out successfully');
    } catch (error) {
      console.error('Error during logout:', error);
    }
    
    localStorage.removeItem('token'); // Clear the token
    navigate('/'); // Redirect to login
  };
  

  const refreshFileList = () => {
    const endpoint = tabIndex == 0 ? 'https://localhost:3001/files/personal' : 'https://localhost:3001/files/shared';
    axios.get(endpoint, {
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
    })
    .then(response => {
      if (tabIndex == 0) {
        setFiles(response.data.files);
      } else {
        setSharedFiles(response.data.files);
      }
    })
    .catch(error => {
      console.error(`Error fetching ${activeTab} files:`, error);
    });
}


React.useEffect(() => {
  refreshFileList();
}, [tabIndex]);

  

  // Function to handle file upload, to be implemented
  const handleFileUpload = (event) => {
    if (!selectedFile) {
      alert('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('isShared', tabIndex === 1); // true for shared, false for personal
    
    axios.post('https://localhost:3001/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(response => {
      console.log('File uploaded successfully');
      refreshFileList();
      // Refresh file list or notify user
    })
    .catch(error => {
      console.error('Error uploading file:', error);
    });
  };

  const handleFileDownload = (fileName) => {
    const isShared = tabIndex == 1; // true for shared files, false for personal files
 
    axios({
      url: `https://localhost:3001/download/${fileName}?isShared=${isShared}`,
      method: 'GET',
      responseType: 'blob', // Important
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(response => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    })
    .catch(error => {
      console.error('Error downloading file:', error);
    });
  };
  
  
  const handleFileDelete = (fileName) => {
    const isShared = tabIndex == 1;
   
    axios.delete(`https://localhost:3001/delete/${fileName}?isShared=${isShared}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(() => {
      console.log('File deleted successfully');
      // Refresh file list or notify user
      setFiles(files.filter(file => file.name !== fileName)); 
      refreshFileList();
    })
    .catch(error => {
      console.error('Error deleting file:', error);
    });
  };

  

  React.useEffect(() => {
    // Determine the correct endpoint based on the user's roles or selection
    const endpoint = (userRoles.includes('view')) ? 'https://localhost:3001/files/shared' : 'https://localhost:3001/files/personal';
  
    axios.get(endpoint, {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    })
    .then(response => {
      setFiles(response.data.files); // Assuming response contains an array of file objects
    })
    .catch(error => {
      console.error('Error fetching files:', error);
    });
  }, [userRoles]);
  

  return (
    <div style={styles.screen}><div style={styles.header}>
    <button 
      onClick={handleLogout} 
      style={{ ...styles.submitButton, ...styles.logoutButton }}
    >
      <FaSignOutAlt /> Logout
    </button>
    </div>
    <div style={styles.container}>
      
        <h1 style={styles.title}>File Management Dashboard</h1>

        
     

    <Tabs style={styles.tabBar} selectedIndex={tabIndex} onSelect={index => setTabIndex(index)}>
        <TabList>
          <Tab style={tabIndex === 0 ? styles.activeTab : styles.tab}>Personal Files</Tab>
          {(userRoles.includes('view') && <Tab style={tabIndex === 1 ? styles.activeTab : styles.tab}>Shared Files</Tab>)}
        </TabList>

        <TabPanel>
       
     
          <div style={styles.fileUploadBar}>
          <input type="file" onChange={handleFileChange} style={styles.uploadInput} />
          <button onClick={handleFileUpload} style={styles.submitButton}>Upload File</button>
          </div>
       
    <table style={styles.table}>
      <thead>
        <tr>
          <th style={styles.fileNameHeader}>File Name</th>
          <th style={styles.iconHeader}>Actions</th>
        </tr>
      </thead>
      <tbody>
      {(files).map((file, index) => (
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
  
    </TabPanel>
    <TabPanel>
    {(tabIndex === 1  && userRoles.includes('upload')) && (
          <div style={styles.fileUploadBar}>
          <input type="file" onChange={handleFileChange} style={styles.uploadInput} />
          <button onClick={handleFileUpload} style={styles.submitButton}>Upload File</button>
          </div>
        )}
    <table style={styles.table}>
      <thead>
        <tr>
          <th style={styles.fileNameHeader}>File Name</th>
          <th style={styles.iconHeader}>Actions</th>
        </tr>
      </thead>
      <tbody>
      {(sharedFiles).map((file, index) => (
          <tr key={index} style={styles.tableRow}>
            <td style={styles.fileName}>{file.name}</td>
            <td style={styles.iconCell}>
              {userRoles.includes('download') && (
              <FaDownload 
                style={{ ...styles.icon, ...styles.downloadIcon }}
                onClick={() => handleFileDownload(file.name)}
              />)}
                {userRoles.includes('delete') && (
              <FaTrash 
                style={{ ...styles.icon, ...styles.deleteIcon }}
                onClick={() => handleFileDelete(file.name)}
              />)}
             
            </td>
          </tr>
        ))}
        </tbody>
      </table>
  
    </TabPanel>
      </Tabs>
      </div>
    </div>
    
);
}
 
const styles = {
  screen: {
      minHeight: '100vh',
      backgroundColor: '#121212', // Dark background color
      color: '#0ff', // Bright cyber color for text
 
  },
  fileUploadBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    padding: 10,
    paddingBottom: 0,
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    display: 'flex',
    justifyContent: 'flex-end',
    
    padding: 13,
  },
  title: {
    marginBottom: '2rem',
    textAlign:'center',
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
  // Button Styles
submitButton: {
  padding: '10px 20px',
  fontSize: '1rem',
  color: '#121212',
  backgroundColor: '#0ff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  transition: 'background-color 0.2s ease, transform 0.2s ease',
  '&:hover': {
    backgroundColor: '#0dd', // Change the color on hover
    transform: 'scale(1.05)' // Slightly increase the size on hover
  }
},

  logoutButton: {
    fontSize: '1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '5px', // Space between icon and text
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
    width: '100%',
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
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    elevation: 20,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000, // Set a high z-index value
  },
  modalContent: {
    backgroundColor: '#333',
    padding: '20px',
    borderRadius: '5px',
    maxWidth: '500px',
    maxHeight: '80%',
    overflowY: 'auto'
  },
  fileContent: {
    whiteSpace: 'pre-wrap', // Keeps the formatting of the text
    wordBreak: 'break-word', // Ensures long text wraps
    maxHeight: '300px', // Set a max height for the content area
    overflowY: 'auto' // Add scrollbar if content is too long
  },
  uploadSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    margin: '20px 0',
  },
  hiddenInput: {
    display: 'none',
  },
  uploadLabel: {
    padding: '10px 20px',
    fontSize: '1rem',
    color: '#121212',
    backgroundColor: '#0ff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
  },
  viewIcon: {
    color: '#0ff',
    cursor: 'pointer',
    transition: 'transform 0.2s, color 0.2s',
    '&:hover': {
      transform: 'scale(1.1)',
      color: '#fff',
    },
  },
  tabBar: {
    padding: '20px',
    width:'80%',
   
    flex:1,    
  },tab: {
    color: '#0ff',
    width:'45%',
    border: 'none',
    padding: '10px',
    
    cursor: 'pointer',
    backgroundColor: 'transparent',
  },
  activeTab: {
    color: 'black',
    width:'45%',
    border: 'none',
    backgroundColor: '#0ff',
  }
};

export default Dashboard;