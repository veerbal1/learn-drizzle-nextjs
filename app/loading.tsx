import { Loader } from "lucide-react";

const Loading = () => {
  return <div className="w-full h-full flex items-center justify-center">
    <Loader className="w-10 h-10 animate-spin" />
  </div>;
};

export default Loading;