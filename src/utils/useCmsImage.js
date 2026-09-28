import { useState, useEffect } from 'react';
import { useStaticContent } from '@context/StaticContent';

/* 
Fetches an image from the CMS using the provided image reference.
Example usage:
const imageHome = useCmsImage('nc_start_app_content-2'); 
*/

const useCmsImage = (imageRef) => {
  const [image, setImage] = useState(null);
  const { staticContentData } = useStaticContent();

  useEffect(() => {
    if (staticContentData && staticContentData.media_image) {
      const findImage = staticContentData.media_image.find((item) => item.image_ref === imageRef);
      if (findImage) setImage(findImage);
    }
  }, [imageRef, staticContentData]);

  return image;
};

export default useCmsImage;
