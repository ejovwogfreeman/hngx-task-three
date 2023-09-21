import React, { useState, useEffect } from "react";
import { ref, getDownloadURL, listAll } from "firebase/storage";
import { collection, getDocs } from "firebase/firestore";
import { storage, db } from "../firebase/firebase";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "../css/ImageGallery.css";
import { AiOutlineSearch } from "react-icons/ai";
import Loader from "../components/Loader";

function ImageGallery() {
  const [imagesData, setImagesData] = useState([]);
  const imagesListRef = ref(storage, "images/");
  const [arrayOfObjects, setArrayOfObjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch image URLs
        const imageUrls = await listAll(imagesListRef);
        const urlsPromises = imageUrls.items.map((item) =>
          getDownloadURL(item).then((url) => url)
        );

        // Fetch tags from Firestore
        const tagsCollection = collection(db, "tags");
        const tagsSnapshot = await getDocs(tagsCollection);

        const tagsData = {};
        let tags = [];
        tagsSnapshot.forEach((doc) => {
          tagsData[doc.id] = doc.data().tag;
          tags.push(tagsData[doc.id]);
        });

        // Wait for both image URLs and tags to resolve
        const [resolvedUrls, resolvedTags] = await Promise.all([
          Promise.all(urlsPromises),
          tagsData,
        ]);

        // Combine image URLs with tags
        const imageData = imageUrls.items.map((item, index) => ({
          image: resolvedUrls[index],
          tag: resolvedTags[item.name], // Use the image's name as the key
        }));

        let arrayOfObjects = tags.map((key, index) => ({
          tag: key,
          image: resolvedUrls[index],
        }));

        setArrayOfObjects(arrayOfObjects);
        setImagesData(imageData);
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

    const updatedImages = [...filteredImages]; // Use filteredImages instead of imagesData
    const [draggedImage] = updatedImages.splice(result.source.index, 1);
    updatedImages.splice(result.destination.index, 0, draggedImage);

    setArrayOfObjects(updatedImages);
  };

  // Filter function to match images based on tag
  const filteredImages = arrayOfObjects.filter((imageData) =>
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
                  {[...filteredImages].reverse().map((imageData, index) => (
                    <Draggable
                      key={imageData.image}
                      draggableId={String(imageData.image)}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="image-container"
                        >
                          <img src={imageData.image} alt="Gallery" />
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
