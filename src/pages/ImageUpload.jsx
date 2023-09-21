// import React, { useState, useRef } from "react";
// import { ref, uploadBytes } from "firebase/storage";
// import { storage } from "../firebase/firebase";
// import { v4 } from "uuid";
// import "../css/ImageUpload.css";
// import { useNavigate } from "react-router-dom/dist";
// import { toast } from "react-toastify";

// function ImageUpload() {
//   const [imageUpload, setImageUpload] = useState(null);
//   const [isPreviewVisible, setPreviewVisible] = useState(false);
//   const [isUploading, setUploading] = useState(false);
//   const fileInputRef = useRef(null);
//   const navigate = useNavigate();

//   const handleFileUpload = () => {
//     if (imageUpload == null || isUploading) return;
//     setUploading(true);

//     const imageRef = ref(storage, `images/${imageUpload.name + v4()}`);
//     uploadBytes(imageRef, imageUpload)
//       .then((snapshot) => {
//         console.log(snapshot);
//         clearPreview();
//         toast.success("IMAGE UPLOADED SUCCESSFULLY");
//         navigate("/");
//       })
//       .finally(() => {
//         setUploading(false);
//       });
//   };

//   const handleFileInputChange = (event) => {
//     const selectedFile = event.target.files[0];
//     setImageUpload(selectedFile);
//     previewImage(selectedFile);
//     setPreviewVisible(true);
//   };

//   const handleDrop = (event) => {
//     event.preventDefault();
//     const file = event.dataTransfer.files[0];
//     setImageUpload(file);
//     previewImage(file);
//     setPreviewVisible(true);
//   };

//   const handleDragOver = (event) => {
//     event.preventDefault();
//   };

//   const previewImage = (file) => {
//     const reader = new FileReader();
//     reader.onload = (e) => {
//       const previewImageElement = document.getElementById("previewImage");
//       previewImageElement.src = e.target.result;
//     };
//     reader.readAsDataURL(file);
//   };

//   const clearPreview = () => {
//     setImageUpload(null);
//     setPreviewVisible(false);
//     const previewImageElement = document.getElementById("previewImage");
//     previewImageElement.src = "";
//   };

//   return (
//     <div className="imageupload-container">
//       <div
//         onDrop={handleDrop}
//         onDragOver={handleDragOver}
//         className="drop-zone"
//       >
//         <span>
//           <p>Drag and drop an image here or</p>
//           <input
//             type="file"
//             accept="image/*"
//             onChange={handleFileInputChange}
//             style={{ display: "none" }}
//             ref={fileInputRef}
//             className="file-input"
//           />
//           <button
//             onClick={() => fileInputRef.current.click()}
//             disabled={isUploading} // Disable the button when uploading
//           >
//             Choose File
//           </button>
//         </span>
//       </div>
//       {isPreviewVisible && (
//         <>
//           <img
//             src=""
//             id="previewImage"
//             alt="Preview"
//             style={{ display: imageUpload ? "block" : "none" }}
//           />
//           <button onClick={handleFileUpload} disabled={isUploading}>
//             {isUploading ? "Uploading..." : "Upload Image"}
//           </button>
//         </>
//       )}
//     </div>
//   );
// }

// export default ImageUpload;

import React, { useState, useRef } from "react";
import { ref, uploadBytes, updateMetadata } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import { storage, db } from "../firebase/firebase"; // Import db from Firebase configuration
import { v4 } from "uuid";
import "../css/ImageUpload.css";
import { useNavigate } from "react-router-dom/dist";
import { toast } from "react-toastify";

function ImageUpload() {
  const [imageUpload, setImageUpload] = useState(null);
  const [isPreviewVisible, setPreviewVisible] = useState(false);
  const [isUploading, setUploading] = useState(false);
  const [tags, setTags] = useState("");
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleFileUpload = () => {
    if (imageUpload == null || isUploading) return;
    setUploading(true);

    const imageRef = ref(storage, `images/${imageUpload.name + v4()}`);
    const metadata = {
      customMetadata: {
        tags: tags,
      },
    };

    if (!tags) {
      toast.error("PLEASE ADD TAGS");
      return setUploading(false);
    }

    uploadBytes(imageRef, imageUpload)
      .then(() => {
        return updateMetadata(imageRef, metadata);
      })
      .then(() => {
        console.log("Image uploaded with tags:", tags);

        // Save the tags to Firestore
        const tagsCollection = collection(db, "tags");
        return addDoc(tagsCollection, {
          tag: tags,
          imageId: imageRef.fullPath, // Use imageRef directly
        });
      })
      .then(() => {
        clearPreview();
        toast.success("IMAGE UPLOADED SUCCESSFULLY");
        navigate("/");
      })
      .catch((error) => {
        console.error("Error uploading image:", error);
        toast.error("ERROR UPLOADING IMAGE");
      })
      .finally(() => {
        setUploading(false);
      });
  };

  const handleFileInputChange = (event) => {
    const selectedFile = event.target.files[0];
    setImageUpload(selectedFile);
    previewImage(selectedFile);
    setPreviewVisible(true);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    setImageUpload(file);
    previewImage(file);
    setPreviewVisible(true);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const previewImage = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const previewImageElement = document.getElementById("previewImage");
      previewImageElement.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  const clearPreview = () => {
    setImageUpload(null);
    setTags("");
    setPreviewVisible(false);
    const previewImageElement = document.getElementById("previewImage");
    previewImageElement.src = "";
  };

  return (
    <div className="imageupload-container">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="drop-zone"
      >
        <span>
          <p>Drag and drop an image here or</p>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileInputChange}
            style={{ display: "none" }}
            ref={fileInputRef}
            className="file-input"
          />
          <button
            onClick={() => fileInputRef.current.click()}
            disabled={isUploading}
          >
            Choose File
          </button>
        </span>
      </div>
      {isPreviewVisible && (
        <>
          <input
            className="tags"
            type="text"
            placeholder="Add tags (comma-separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            disabled={isUploading}
          />{" "}
          <br />
          <img
            src=""
            id="previewImage"
            alt="Preview"
            style={{ display: imageUpload ? "block" : "none" }}
          />
          <button onClick={handleFileUpload} disabled={isUploading}>
            {isUploading ? "Uploading..." : "Upload Image"}
          </button>
        </>
      )}
    </div>
  );
}

export default ImageUpload;
