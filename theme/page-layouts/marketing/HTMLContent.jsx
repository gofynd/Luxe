import React from "react";

export const HTMLContent = React.forwardRef(({ content }, ref) => (
  <>
    {/* eslint-disable-next-line react/no-danger */}
    <div
      data-testid="html-content"
      ref={ref}
      suppressHydrationWarning
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: content }}
    />
  </>
));
