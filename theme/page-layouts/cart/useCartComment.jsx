import React, { useState, useEffect, useCallback } from "react";
import { debounce } from "../../helper/utils";
import { CART_META_UPDATE } from "../../queries/cartQuery";

const useCartComment = ({ fpi, cartData }) => {
  const [comment, setComment] = useState(cartData.comment);

  useEffect(() => {
    setComment(cartData.comment);
  }, [cartData]);

  const updateComment = (comm) => {
    const payload = {
      updateCartMetaId: cartData.id?.toString(),
      cartMetaRequestInput: {
        comment: comm?.toString(),
      },
    };
    fpi.executeGQL(CART_META_UPDATE, payload);
  };

  /* eslint-disable-next-line react-hooks/exhaustive-deps */
  const debounceUpdate = useCallback(
    debounce((newComment) => {
      updateComment(newComment);
    }, 500),
    []
  );

  const onCommentChange = (comm) => {
    setComment(comm);
    debounceUpdate(comm);
  };

  return {
    comment,
    onCommentChange,
  };
};

export default useCartComment;
