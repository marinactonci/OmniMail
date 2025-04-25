import { useRegisterActions } from "kbar";
import { useLocalStorage } from "usehooks-ts";

const useComposeSwitching = () => {
  const [isComposeOpen, setIsComposeOpen] = useLocalStorage(
    "isComposeOpen",
    false
  );
  const toggleCompose = () => {
    setIsComposeOpen(!isComposeOpen);
  };

  const composeActions = [
    {
      id: "toggleCompose",
      name: "Compose",
      shortcut: ["c"],
      section: "Compose",
      perform: toggleCompose,
    },
  ];

  useRegisterActions(composeActions, [isComposeOpen]);
};

export default useComposeSwitching;
