import "../styles/global.css";
import "../styles/boostrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import { StateProvider } from "../components/context/state";

export default function App({ Component, pageProps }) {
  const initialState = {
    links: [],
  };

  const reducer = (state, action) => {
    // console.log("reducre");
    // console.log(state);
    // console.log(action);
    switch (action.type) {
      case "updateLink":
        return {
          links: action.linkdata,
        };
      case "deleteLink":
        // console.log(state.links.filter((ele) => ele.id != action.id));
        return {
          links: state.links.filter((ele) => ele.id != action.id),
        };
      default:
        return state;
    }
  };

  return (
    <StateProvider initialState={initialState} reducer={reducer}>
      <Component {...pageProps} />
    </StateProvider>
  );
}
