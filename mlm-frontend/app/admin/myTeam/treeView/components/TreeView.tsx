"use client";

import React from "react";
import TreeNode from "./TreeNode";

interface TreeData {
  id: string;
  left?: TreeData;
  right?: TreeData;
}

interface TreeViewProps {
  data: TreeData;
}

const TreeView: React.FC<TreeViewProps> = ({ data }) => {
  return (
    <div className="flex justify-center">
      <ul className="relative flex flex-col items-center">
        <li className="relative flex flex-col items-center">
          {/* Root Node */}
          <TreeNode id={data.id} />

          {/* Children */}
          {(data.left || data.right) && (
            <ul
              className="
                relative flex justify-center items-start pt-10 sm:pt-12
                before:content-[''] before:absolute before:top-0 before:left-1/2 before:-translate-x-1/2 
                before:w-0 before:h-8 before:border-l-2 before:border-gray-700
              "
            >
              {data.left && (
                <li
                  className="
                    relative flex flex-col items-center px-10
                    before:content-[''] before:absolute before:top-0 before:right-0
                    before:w-[calc(50%+40px)] before:border-t-2 before:border-gray-700
                    after:content-[''] after:absolute after:top-0 after:left-1/2
                    after:w-0 after:h-8 after:border-l-2 after:border-gray-700
                  "
                >
                  <TreeView data={data.left} />
                </li>
              )}

              {data.right && (
                <li
                  className="
                    relative flex flex-col items-center px-10
                    before:content-[''] before:absolute before:top-0 before:left-0
                    before:w-[calc(50%+40px)] before:border-t-2 before:border-gray-700
                    after:content-[''] after:absolute after:top-0 after:left-1/2
                    after:w-0 after:h-8 after:border-l-2 after:border-gray-700
                  "
                >
                  <TreeView data={data.right} />
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
