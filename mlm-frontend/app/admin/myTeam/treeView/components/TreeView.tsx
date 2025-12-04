"use client";

import React from "react";
import TreeNode from "./TreeNode";

interface TreeNodeData {
  id: string;
  name: string;
  photo?: string | null;
  left?: TreeNodeData | null;
  right?: TreeNodeData | null;
}


interface TreeViewProps {
  data: TreeNodeData;
  onNodeDoubleClick: (id: string) => void;
  level?: number;   // ⭐ NEW
}

const TreeView: React.FC<TreeViewProps> = ({
  data,
  onNodeDoubleClick,
  level = 0,         // ⭐ DEFAULT ROOT LEVEL
}) => {
  const isVacant = data.id === "Vacant";

  const children: TreeNodeData[] = [];
  if (data.left) children.push(data.left);
  if (data.right) children.push(data.right);

  const hasTwoChildren = children.length === 2;

  /* ============================================
      LEVEL-BASED HORIZONTAL LINE WIDTH
     ============================================ */

  let lineLeft = "25%";
  let lineRight = "25%";

  if (level === 0) {
    // Under ROOT
    lineLeft = "25.5%";
    lineRight = "23%";
  } else if (level === 1) {
    lineLeft = "24.8%";
    lineRight = "22%";
  } else if (level === 2) {
    lineLeft = "22%";
    lineRight = "22%";
  } else if (level === 3) {
    lineLeft = "17%";
    lineRight = "18%";
  }

  return (
    <div className="flex justify-center">
      <ul className="flex flex-col items-center">
        <li className="flex flex-col items-center relative">

          {/* Node */}
          <TreeNode
            id={data.id}
            name={data.name}
            data={data}   // contains phone, sponsor_name, bv
            photo={data.photo}
            onDoubleClick={() => !isVacant && onNodeDoubleClick(data.id)}
          />


          {/* Stop if no children */}
          {children.length === 0 ? null : (
            <>
              {/* Vertical line */}
              <div className="w-[2px] h-6 bg-green-700"></div>

              {/* CHILDREN WRAPPER */}
              <div className="relative flex justify-center gap-14">

                {/* HORIZONTAL LINE = controlled by LEVEL */}
                {hasTwoChildren && (
                  <div
                    className="absolute top-0 h-[2px] bg-green-700"
                    style={{
                      left: lineLeft,
                      right: lineRight,
                    }}
                  ></div>
                )}

                {/* RENDER CHILDREN */}
                {children.map((child, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div className="w-[2px] h-6 bg-green-700"></div>
                    <TreeView
                      data={child}
                      onNodeDoubleClick={onNodeDoubleClick}
                      level={level + 1}   // ⭐ PASS LEVEL TO CHILD
                    />
                  </div>
                ))}

              </div>
            </>
          )}

        </li>
      </ul>
    </div>
  );
};

export default TreeView;
