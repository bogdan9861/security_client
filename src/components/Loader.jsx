import React from "react";
import "../animations/animations.css";
import { LoaderIcon } from "lucide-react";

const Loader = () => {
  return (
    <div>
      <LoaderIcon className="rotating" />
    </div>
  );
};

export default Loader;
