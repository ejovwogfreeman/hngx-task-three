import React, { useState, useEffect } from "react";
import { ref, getDownloadURL, listAll } from "firebase/storage";
import { storage } from "../firebase/firebase";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "../css/ImageGallery.css";
import Loader from "../components/Loader";

function ImageGallery() {
  const [imageUrls, setImageUrls] = useState([]);
  const imagesListRef = ref(storage, "images/");

  useEffect(() => {
    listAll(imagesListRef)
      .then((response) => {
        const urlPromises = response.items.map((item) =>
          getDownloadURL(item).then((url) => url)
        );

        return Promise.all(urlPromises);
      })
      .then((urls) => {
        setImageUrls(urls.reverse());
      });
  }, []);

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const updatedImages = [...imageUrls];
    const [draggedImage] = updatedImages.splice(result.source.index, 1);
    updatedImages.splice(result.destination.index, 0, draggedImage);

    setImageUrls(updatedImages);
  };

  return (
    <>
      {imageUrls.length > 0 ? (
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
                  {imageUrls.map((image, index) => (
                    <Draggable key={image} draggableId={image} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="image-container"
                        >
                          <img src={image} alt="Gallery" />
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
        <Loader />
      )}
    </>
  );
}

export default ImageGallery;
