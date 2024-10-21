import React from "react";


export interface MenuItem {
  text: string;
  onClick: (e?: React.MouseEvent) => void;
}