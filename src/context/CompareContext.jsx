import {
  createContext,
  useContext,
  useState,
} from "react";

const CompareContext = createContext();

const MAX_COMPARE_LIMIT = 4;

// Resolves a stable id whether the product uses Mongo's _id or a plain id
const getProductId = (product) => product?._id || product?.id;

export const CompareProvider = ({ children }) => {

  const [compareList, setCompareList] = useState([]);

  const addToCompare = (product) => {
    const productId = getProductId(product);

    setCompareList((prev) => {
      const alreadyExists = prev.find((item) => getProductId(item) === productId);
      if (alreadyExists) {
        return prev;
      }

      if (prev.length >= MAX_COMPARE_LIMIT) {
        console.log("Max compare limit reached");
        return prev;
      }

      return [...prev, product];
    });
  };

  const removeFromCompare = (productId) => {
    setCompareList((prev) => prev.filter((item) => getProductId(item) !== productId));
  };

  const clearCompare = () => {
    setCompareList([]);
  };

  const isInCompare = (productId) => {
    return compareList.some((item) => getProductId(item) === productId);
  };

  return (
    <CompareContext.Provider
      value={{
        compareList,
        setCompareList,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isInCompare,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => useContext(CompareContext);