// components/ImageWithText.js
import Image from "next/image";
import styles from "@/style/ImageWithText.module.css";

const ImageWithText = ({ imageSrc, altText, text, textPosition }) => {
  return (
    <div className={styles.imageContainer}>
      <div className={styles.imageWrapper}>
        <Image src={imageSrc} alt={altText} layout="fill" objectFit="cover" />
      </div>
      <div
        className={styles.textOverlay}
        style={{
          top: textPosition?.top || "50%",
          left: textPosition?.left || "50%",
          transform: "translate(-50%, -50%)", // This centres the text
        }}
      >
        {text}
      </div>
    </div>
  );
};

export default ImageWithText;
