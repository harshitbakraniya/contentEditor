import React from "react";

const Button = ({
  type = "submit",
  className,
  title,
  buttonText,
  icon,
  clickHandler,
}) => {
  return (
    <button
      type={type}
      //   onClick={() => editor.chain().focus().toggleUnderline().run()}
      onClick={clickHandler}
      className={`p-1 ${
        className
        // editor.isActive("underline") ? "bg-gray-200" : ""
      }`}
      title={title}
    >
      {icon && icon}
      {buttonText && buttonText}
    </button>
  );
};

export default Button;
