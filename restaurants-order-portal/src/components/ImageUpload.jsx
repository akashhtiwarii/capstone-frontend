import React from 'react';

const ImageUpload = ({ image, name, isEditing, setRestaurant }) => {
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setRestaurant((prevState) => ({
          ...prevState,
          image: reader.result.split(',')[1],
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return isEditing ? (
    <input type="file" onChange={handleImageChange} />
  ) : (
    <img
      src={image ? `data:image/jpeg;base64,${image}` : 'https://via.placeholder.com/150'}
      alt={name}
      className="restaurant-detail-image"
    />
  );
};

export default ImageUpload;
