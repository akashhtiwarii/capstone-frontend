import React from 'react';

const ImageUpload = ({ image, isEditing, setImage }) => {
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result.split(',')[1]); // Update the state with the base64 image data
      };
      reader.readAsDataURL(file);
    }
  };

  return isEditing ? (
    <input type="file" onChange={handleImageChange} />
  ) : (
    <img
      src={image ? `data:image/jpeg;base64,${image}` : 'https://via.placeholder.com/150'}
      alt="Restaurant"
      className="restaurant-detail-image"
    />
  );
};

export default ImageUpload;
