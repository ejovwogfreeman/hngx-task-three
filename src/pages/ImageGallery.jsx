import React, { useState, useEffect } from "react";
import { ref, getDownloadURL } from "firebase/storage";
import { collection, getDocs } from "firebase/firestore";
import { storage, db } from "../firebase/firebase";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "../css/ImageGallery.css";
import { AiOutlineSearch } from "react-icons/ai";
import Loader from "../components/Loader";

function ImageGallery() {
  const [imagesData, setImagesData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const imagesListRef = ref(storage, "");

  useEffect(() => {
    async function fetchData() {
      try {
        const tagsCollection = collection(db, "tags");
        const tagsSnapshot = await getDocs(tagsCollection);
        const tagsData = [];

        tagsSnapshot.forEach((doc) => {
          tagsData.push(doc.data());
        });

        const imageUrls = await Promise.all(
          tagsData.map(async (tagData) => {
            const imageUrlRef = ref(imagesListRef, tagData.imageId);
            const imageUrl = await getDownloadURL(imageUrlRef);
            return { ...tagData, imageUrl };
          })
        );

        setImagesData(imageUrls);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const updatedImages = [...imagesData];
    const [draggedImage] = updatedImages.splice(result.source.index, 1);
    updatedImages.splice(result.destination.index, 0, draggedImage);

    setImagesData(updatedImages);
  };

  const filteredImages = imagesData.filter((imageData) =>
    imageData.tag.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="search-form">
        <div>
          <AiOutlineSearch />
          <input
            type="text"
            placeholder="Search by tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      {filteredImages.length > 0 ? (
        <div className="imagegallery-container">
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable
              droppableId="imageGallery"
              direction="horizontal"
              isCombineEnabled={false}
            >
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="image-gallery"
                >
                  {filteredImages.map((imageData, index) => (
                    <Draggable
                      key={imageData.imageId}
                      draggableId={imageData.imageId}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="image-container"
                        >
                          <img src={imageData.imageUrl} alt="Gallery" />
                          <span className="tags">
                            {imageData.tag.split(", ").map((x, index) => (
                              <span key={index}>{x}</span>
                            ))}
                          </span>{" "}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      ) : (
        <>
          <Loader />
        </>
      )}
    </>
  );
}

export default ImageGallery;
