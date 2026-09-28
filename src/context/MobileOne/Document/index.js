/* eslint-disable prefer-const */
/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useStaticContent } from '@context/StaticContent';
import { appPdfList, getAppPdfIds } from '@utils/globalConstant';

export const DocumentContext = createContext({});

export function DocumentContextProvider({ children }) {
  // States
  const [isLoading, setIsLoading] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [productInfoPdfs, setProductInfoPdfs] = useState([]);
  const [termsInfoPdfs, setTermsInfoPdfs] = useState([]);
  const [privacyInfoPdfs, setPrivacyInfoPdfs] = useState([]);
  const [evnPdfs, setEvnPdfs] = useState({});
  const [agbPdfs, setAgbPdfs] = useState({});
  const [priceListPdf, setPriceListPdf] = useState({});
  const [mnpPdfs, setMnpPdfs] = useState([]);
  const [explainerVideos, setExplainerVideos] = useState([]);
  const [mediaPdfs, setMediaPdfs] = useState([]);
  const [mediaImages, setMediaImages] = useState([]);
  const [activationVideo, setActivationVideo] = useState({});
  const [appPopupImage, setAppPopupImage] = useState({});
  const [loginBgImage, setLoginBgImage] = useState({});
  const [advantagesImgBg, setAdvantagesImgBg] = useState({});
  const [serviceImgBg, setServiceImgBg] = useState({});
  const [advantagesTopupImgBg, setAdvantagesTopupImgBg] = useState({});
  const [advantagesLoyaltyImgBg, setAdvantagesLoyaltyImgBg] = useState({});
  const [advantagesBirthdayImgBg, setAdvantagesBirthdayImgBg] = useState({});
  const [questionsData, setQuestionsData] = useState([]);
  const [selectedCategoryData, setSelectedCategoryData] = useState([]);

  const [advantagesEmployeeImgBg, setAdvantagesEmployeeImgBg] = useState({});
  const [advantagesBirthdayContentImg, setAdvantagesBirthdayContentImg] = useState({});
  const [advantagesTopupContentImg, setAdvantagesTopupContentImg] = useState({});

  const [advantagesLoyalityContentImg, setAdvantagesLoyalityContentImg] = useState({});

  const [advantagesEmployeeContentImg, setAdvantagesEmployeeContentImg] = useState({});

  // Context
  const { staticContentData } = useStaticContent();
  const appPdfIds = getAppPdfIds();

  // Validations

  // Functions

  const getExplainerVideos = () => {
    if (staticContentData) {
      const videoIds = staticContentData.nr_explanationVideos
        ? staticContentData.nr_explanationVideos
        : [];
      const mediaVideo = staticContentData.media_video ? staticContentData.media_video : [];
      const imagePreview = staticContentData.media_image ? staticContentData.media_image : [];
      // eslint-disable-next-line prefer-const
      let finalVideos = [];

      videoIds.forEach((elem, i) => {
        const { previewImg = [], image_ref } = elem;
        const videoPreviewId = ['3x'];
        let videoPreviewImg;

        imagePreview.forEach((img, j) => {
          // eslint-disable-next-line eqeqeq
          if (image_ref == img.image_ref) {
            videoPreviewImg = img;
          }
        });

        mediaVideo.forEach((vid, k) => {
          if (elem.id === vid.id) {
            finalVideos.push({ ...elem, ...vid, previewImageRef: elem.image_ref });
          }
        });
      });

      setExplainerVideos(finalVideos);
    }
  };

  // To get EVN category PDF
  const getEvnPdf = () => {
    if (staticContentData) {
      const evnPdfids = staticContentData.evn ? staticContentData.evn : [];
      const allMediaPdfs = staticContentData.media_pdf ? staticContentData.media_pdf : [];
      const evnPdf = allMediaPdfs.find((pdf) => pdf.id === appPdfIds.EVN);

      // allMediaPdfs.forEach((pdf, i) => {
      //   // eslint-disable-next-line eqeqeq
      //   if (evnPdfids.id == pdf.id) {
      //     evnPdfsList.push(pdf);
      //   }
      // });

      setEvnPdfs(evnPdf);
    }
  };

  // To get EVN category PDF
  const getMnpPdf = () => {
    if (staticContentData) {
      const mnpPdfids = staticContentData.ek_pdfMnp ? staticContentData.ek_pdfMnp : [];
      const allMediaPdfs = staticContentData.media_pdf ? staticContentData.media_pdf : [];
      const mnpPdfsList = [];

      allMediaPdfs.forEach((pdf, i) => {
        // eslint-disable-next-line eqeqeq
        if (mnpPdfids.id == pdf.id) {
          mnpPdfsList.push(pdf);
        }
      });

      setMnpPdfs(mnpPdfsList[0]);
    }
  };

  // REFACTOR: CMS key nr_pdfListExternal does not exit anymore
  // To get different category PDFs
  const getPdfs = () => {
    // if (staticContentData) {

    //   const pdfsList = staticContentData.nr_pdfListExternal;
    //   const productPdfs = [];
    //   const privacyPdfs = [];
    //   const termsPdfs = [];

    //   pdfsList.forEach((elem, i) => {
    //       if (elem.listName ===  appPdfList.PRODUCT_SHEET) {
    //           elem.listRedirection.forEach((item, j) => {
    //               productPdfs.push(item);
    //           });
    //       } else if (elem.listName === appPdfList.TERMS) {
    //           elem.listRedirection.forEach((item, j) => {
    //               termsPdfs.push(item);
    //           });
    //       } else if (elem.listName === appPdfList.PRIVACY) {
    //           elem.listRedirection.forEach((item, j) => {
    //               privacyPdfs.push(item);
    //           });
    //       }
    //   });

    //   const evnPdf = termsPdfs.find((pdf) => `${pdf.pdfId}` === appPdfIds.EVN);
    //   const priceListPdfs = termsPdfs.find((pdf) => Number(`${pdf.pdfId}`) === Number(appPdfIds.PRICELIST));
    //   const agbPdf = termsPdfs.find((pdf) => `${pdf.pdfId}` === appPdfIds.AGB);
    //   setPriceListPdf(priceListPdfs);
    //   setEvnPdfs(evnPdf);
    //   setAgbPdfs(agbPdf);
    //   setProductInfoPdfs(productPdfs.sort((a, b) => a.sortOrder - b.sortOrder));
    //   setTermsInfoPdfs(termsPdfs.sort((a, b) => a.sortOrder - b.sortOrder));
    //   setPrivacyInfoPdfs(privacyPdfs.sort((a, b) => a.sortOrder - b.sortOrder));
    // }
  };

  const getMediaImgs = () => {
    if (staticContentData) {
      const images = staticContentData.media_image ? staticContentData.media_image : [];
      if (images) {
        setMediaImages(images);
        const appImage = images.find((img) => img.image_ref === 'nc-img-modal-woman');
        const bgimg = images.find(({ image_ref }) => image_ref === 'ek_web_login_bg');
        const advantagesimg = images.find(({ image_ref }) => image_ref === 'ek_web_advantages_bg');

        const advantagestopopimg = images.find(
          ({ image_ref }) => image_ref === 'ek_web_advantages-topup_bg'
        );

        const serviceimg = images.find(({ image_ref }) => image_ref === 'ek_web_service_bg');

        const advantagesemployeeimg = images.find(
          ({ image_ref }) => image_ref === 'ek_web_advantages-employee_bg'
        );

        const advantagesloyalityimg = images.find(
          ({ image_ref }) => image_ref === 'ek_web_advantages-loyality_bg'
        );

        const advantagesbirthdayimg = images.find(
          ({ image_ref }) => image_ref === 'ek_web_advantages-birthday_bg'
        );

        const advantagesbirthdaycontentimg = images.find(
          ({ image_ref }) => image_ref === 'ek_web_advantages-birthday_content-1'
        );

        const advantagestopupcontentimg = images.find(
          ({ image_ref }) => image_ref === 'ek_web_advantages-topup_content-1'
        );

        const advantagesloyalitycontentimg = images.find(
          ({ image_ref }) => image_ref === 'ek_web_advantages-loyality_content-1'
        );

        const advantagesemployeecontentimg = images.find(
          ({ image_ref }) => image_ref === 'ek_web_advantages-employee_content-1'
        );

        setLoginBgImage(bgimg);
        setAppPopupImage(appImage);
        if (advantagesimg) {
          setAdvantagesImgBg(advantagesimg);
        }
        setServiceImgBg(serviceimg);
        setAdvantagesEmployeeImgBg(advantagesemployeeimg);
        setAdvantagesLoyaltyImgBg(advantagesloyalityimg);
        setAdvantagesBirthdayImgBg(advantagesbirthdayimg);
        setAdvantagesTopupImgBg(advantagestopopimg);
        if (advantagestopopimg) {
          setAdvantagesTopupImgBg(advantagestopopimg);
        }
        setAdvantagesBirthdayContentImg(advantagesbirthdaycontentimg);
        setAdvantagesTopupContentImg(advantagestopupcontentimg);

        setAdvantagesLoyalityContentImg(advantagesloyalitycontentimg);
        setAdvantagesEmployeeContentImg(advantagesemployeecontentimg);
      }
    }
  };

  const getFaqData = () => {
    const staticData = staticContentData;
    if (staticData.faq != null && staticData.faq.length > 0) {
      // Updating data , so that we can get an faq array with type and respective questions

      const faqData = staticData.faq;
      let faqTypes = [];
      const faqFinalData = [];
      if (faqData != null && faqData.length > 0) {
        faqData.forEach((elem, i) => {
          faqTypes.push(elem.category);
        });
        faqTypes = faqTypes.filter((item, i, ar) => ar.indexOf(item) === i).sort();
        faqTypes.forEach((elem, i) => {
          const catData = [];
          faqData.forEach((data, j) => {
            if (elem === data.category) {
              // eslint-disable-next-line no-param-reassign
              data.selected = false;
              catData.push(data);
            }
          });
          faqFinalData.push({
            category: elem,
            data: catData,
            // eslint-disable-next-line no-unneeded-ternary
            selected: i === 0 ? true : false
          });
        });
        setQuestionsData(faqFinalData);
        setSelectedCategoryData(faqFinalData[0].data);
      }
    }
  };
  
  const getActivationVideo = () => {
    if (staticContentData && staticContentData.nr_activationVideo) {
      const mediaVideos = staticContentData.media_video ? staticContentData.media_video : [];
      const videos = staticContentData.nr_activationVideo ? staticContentData.nr_activationVideo : [];

      let finalVideos = [];
      videos.forEach((elem, i) => {

        mediaVideos.forEach((vid, j) => {
          if (elem.id === vid.id) {
            finalVideos.push({ ...vid, previewImageRef: elem.image_ref, videoCopy: elem.videoCopy, videoDuration: elem.videoDuration });
          }
        })
      });

      // const video = videos.find(({ id }) => id === videos.id);
      setActivationVideo(finalVideos[0] || {});
    }
  };

  const getVideoPreview = (imageRef) => {
    let videoPreview = '';
    if (staticContentData) {
      if (staticContentData.media_image) {
        const images = staticContentData.media_image;
        const videoImg = images.find((img) => img.image_ref === imageRef);
        videoPreview = videoImg?.media_url_display;
      }
    }
    return videoPreview;
  };

  const downloadDocPDF = (link) => {
    window.location.href = link;
  };

  // Hooks
  useEffect(() => {
    if (staticContentData) {
      getMnpPdf();
      getPdfs();
      getMediaImgs();
      getFaqData();
      getActivationVideo();
    }
  }, [staticContentData]);

  // We wrap it in a useMemo for performance reason
  const contextPayload = useMemo(
    () => ({
      // States
      isLoading,
      setIsLoading,
      productInfoPdfs,
      termsInfoPdfs,
      privacyInfoPdfs,
      evnPdfs,
      setEvnPdfs,
      agbPdfs,
      setAgbPdfs,
      explainerVideos,
      mnpPdfs,
      setMnpPdfs,
      mediaPdfs,
      setMediaPdfs,
      activationVideo,
      isVideoModalOpen,
      setIsVideoModalOpen,
      mediaImages,
      appPopupImage,
      loginBgImage,
      advantagesImgBg,
      serviceImgBg,
      advantagesTopupImgBg,
      advantagesLoyaltyImgBg,
      advantagesBirthdayImgBg,
      advantagesEmployeeImgBg,
      advantagesBirthdayContentImg,
      advantagesTopupContentImg,
      advantagesLoyalityContentImg,
      advantagesEmployeeContentImg,
      questionsData,
      setQuestionsData,
      selectedCategoryData,
      setSelectedCategoryData,
      priceListPdf,
      setPriceListPdf,
      // functions
      getPdfs,
      downloadDocPDF,
      getEvnPdf,
      getExplainerVideos,
      getVideoPreview
    }),
    [
      // States
      isLoading,
      setIsLoading,
      productInfoPdfs,
      termsInfoPdfs,
      privacyInfoPdfs,
      evnPdfs,
      setEvnPdfs,
      agbPdfs,
      setAgbPdfs,
      explainerVideos,
      mnpPdfs,
      setMnpPdfs,
      mediaPdfs,
      setMediaPdfs,
      activationVideo,
      isVideoModalOpen,
      setIsVideoModalOpen,
      mediaImages,
      appPopupImage,
      loginBgImage,
      advantagesImgBg,
      serviceImgBg,
      advantagesTopupImgBg,
      advantagesLoyaltyImgBg,
      advantagesBirthdayImgBg,
      advantagesEmployeeImgBg,
      advantagesBirthdayContentImg,
      advantagesTopupContentImg,
      advantagesLoyalityContentImg,
      advantagesEmployeeContentImg,
      questionsData,
      setQuestionsData,
      selectedCategoryData,
      setSelectedCategoryData,
      priceListPdf,
      setPriceListPdf,
      // functions
      getPdfs,
      downloadDocPDF,
      getEvnPdf,
      getExplainerVideos,
      getVideoPreview
    ]
  );

  // We expose the context's value down to our components, while
  // also making sure to render the proper content to the screen
  return <DocumentContext.Provider value={contextPayload}>{children}</DocumentContext.Provider>;
}
DocumentContextProvider.propTypes = {
  children: PropTypes.node.isRequired
};
// A custom hook to quickly read the context's value. It's
// only here to allow quick imports
export const useDocument = () => useContext(DocumentContext);

export default DocumentContext;
