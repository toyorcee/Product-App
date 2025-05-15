import { useDispatch } from "react-redux";
import { addActivity } from "../slices/activitySlice";

export const useActivity = () => {
  const dispatch = useDispatch();

  const trackActivity = (type, message) => {
    dispatch(addActivity({ type, message }));
  };

  const trackCartActivity = (action, product) => {
    const messages = {
      add: `Added ${product.title} to cart`,
      remove: `Removed ${product.title} from cart`,
      increase: `Increased quantity of ${product.title}`,
      decrease: `Decreased quantity of ${product.title}`,
    };
    trackActivity("cart", messages[action]);
  };

  const trackViewActivity = (product) => {
    trackActivity("view", `Viewed ${product.title}`);
  };

  const trackCategoryActivity = (category) => {
    trackActivity("category", `Browsed ${category} category`);
  };

  return {
    trackActivity,
    trackCartActivity,
    trackViewActivity,
    trackCategoryActivity,
  };
};
