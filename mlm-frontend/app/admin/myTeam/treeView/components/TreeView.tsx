"use client";
import React from "react";
import TreeNode from "./TreeNode";

interface TreeNodeData {
  id: string;
  name: string;
  photo?: string | null;
  left?: TreeNodeData;
  right?: TreeNodeData;
}

interface TreeViewProps {
  data: TreeNodeData;
  isRoot?: boolean;
  onNodeDoubleClick: (id: string) => void;
}

const TreeView: React.FC<TreeViewProps> = ({ data, isRoot = true, onNodeDoubleClick }) => {
  return (
    <div className="flex justify-center">
      <ul className="flex flex-col items-center">
        <li className="relative flex flex-col items-center">
          <TreeNode
            id={data.id}
            name={data.name}
            photo={data.photo}
            onDoubleClick={() => onNodeDoubleClick(data.id)}
          />

          {(data.left || data.right) && (
            <ul
              className={`flex justify-center pt-4 relative ${
                !isRoot
                  ? "before:content-[''] before:absolute before:top-[-4px] before:left-1/2 before:-translate-x-1/2 before:w-0 before:h-3 before:border-l before:border-green-700"
                  : ""
              }`}
            >
              {data.left && (
                <li className="relative px-3 before:content-[''] before:absolute before:top-0 before:right-0 before:w-[50%] before:border-t before:border-green-700 after:content-[''] after:absolute after:top-0 after:right-0 after:h-3 after:border-l after:border-green-700">
                  <TreeView
                    data={data.left}
                    isRoot={false}
                    onNodeDoubleClick={onNodeDoubleClick}
                  />
                </li>
              )}

              {data.right && (
                <li className="relative px-3 before:content-[''] before:absolute before:top-0 before:left-0 before:w-[50%] before:border-t before:border-green-700 after:content-[''] after:absolute after:top-0 after:left-0 after:h-3 after:border-l after:border-green-700">
                  <TreeView
                    data={data.right}
                    isRoot={false}
                    onNodeDoubleClick={onNodeDoubleClick}
                  />
                </li>
              )}
            </ul>
          )}
        </li>
      </ul>
    </div>
  );
};

export default TreeView;

