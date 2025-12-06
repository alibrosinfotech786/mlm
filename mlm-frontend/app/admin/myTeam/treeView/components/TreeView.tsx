"use client";

import React, { useRef, useEffect, useState } from "react";
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
  level?: number;
}

const TreeView: React.FC<TreeViewProps> = ({
  data,
  onNodeDoubleClick,
  level = 0,
}) => {
  const isVacant = data.id === "Vacant";
  const nodeRef = useRef<HTMLDivElement>(null);
  const childrenWrapperRef = useRef<HTMLDivElement>(null);
  const leftChildRef = useRef<HTMLDivElement>(null);
  const rightChildRef = useRef<HTMLDivElement>(null);
  const [lineStyle, setLineStyle] = useState<{
    left: string;
    right: string;
    display: string;
  }>({ left: "0%", right: "0%", display: "none" });

  const children: TreeNodeData[] = [];
  if (data.left) children.push(data.left);
  if (data.right) children.push(data.right);

  const hasTwoChildren = children.length === 2;
  const hasLeftChild = data.left !== null && data.left !== undefined;
  const hasRightChild = data.right !== null && data.right !== undefined;

  // Calculate horizontal line position dynamically
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let rafId: number;

    const calculateLinePosition = () => {
      if (
        hasTwoChildren &&
        childrenWrapperRef.current &&
        leftChildRef.current &&
        rightChildRef.current
      ) {
        const wrapper = childrenWrapperRef.current;
        const leftChild = leftChildRef.current;
        const rightChild = rightChildRef.current;

        const wrapperRect = wrapper.getBoundingClientRect();
        const leftRect = leftChild.getBoundingClientRect();
        const rightRect = rightChild.getBoundingClientRect();

        // Calculate center points of child nodes relative to wrapper
        const leftCenter = leftRect.left + leftRect.width / 2 - wrapperRect.left;
        const rightCenter = rightRect.left + rightRect.width / 2 - wrapperRect.left;
        const wrapperWidth = wrapperRect.width;

        // Ensure we have valid measurements
        if (wrapperWidth > 0 && leftCenter >= 0 && rightCenter >= 0) {
          // Calculate percentages from wrapper edges
          const leftPercent = Math.max(0, Math.min(50, (leftCenter / wrapperWidth) * 100));
          const rightPercent = Math.max(0, Math.min(50, ((wrapperWidth - rightCenter) / wrapperWidth) * 100));

          setLineStyle({
            left: `${leftPercent}%`,
            right: `${rightPercent}%`,
            display: "block",
          });
        }
      } else {
        setLineStyle({
          left: "0%",
          right: "0%",
          display: "none",
        });
      }
    };

    // Use requestAnimationFrame and setTimeout to ensure DOM is ready
    rafId = requestAnimationFrame(() => {
      timeoutId = setTimeout(() => {
        calculateLinePosition();
      }, 10);
    });

    // Recalculate on window resize
    window.addEventListener("resize", calculateLinePosition);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (timeoutId) clearTimeout(timeoutId);
      window.removeEventListener("resize", calculateLinePosition);
    };
  }, [hasTwoChildren, children.length, data.id]);

  return (
    <div className="flex justify-center">
      <ul className="flex flex-col items-center min-w-max">
        <li className="flex flex-col items-center relative">
          {/* Node */}
          <div ref={nodeRef}>
            <TreeNode
              id={data.id}
              name={data.name}
              data={data}
              photo={data.photo}
              onDoubleClick={() => !isVacant && onNodeDoubleClick(data.id)}
            />
          </div>

          {/* Stop if no children */}
          {children.length === 0 ? null : (
            <>
              {/* Vertical line from parent to children */}
              <div className="w-[2px] h-6 bg-green-700"></div>

              {/* CHILDREN WRAPPER */}
              <div
                ref={childrenWrapperRef}
                className="relative flex justify-center gap-10 sm:gap-14 md:gap-20 lg:gap-24"
              >
                {/* HORIZONTAL LINE - dynamically positioned */}
                {hasTwoChildren && (
                  <div
                    className="absolute top-0 h-[2px] bg-green-700 z-0"
                    style={{
                      left: lineStyle.left,
                      right: lineStyle.right,
                      display: lineStyle.display,
                    }}
                  ></div>
                )}

                {/* LEFT CHILD */}
                {hasLeftChild && (
                  <div
                    ref={leftChildRef}
                    className="flex flex-col items-center relative z-10"
                  >
                    {/* Vertical line from horizontal line to left child */}
                    <div className="w-[2px] h-6 bg-green-700"></div>
                    <TreeView
                      data={data.left!}
                      onNodeDoubleClick={onNodeDoubleClick}
                      level={level + 1}
                    />
                  </div>
                )}

                {/* RIGHT CHILD */}
                {hasRightChild && (
                  <div
                    ref={rightChildRef}
                    className="flex flex-col items-center relative z-10"
                  >
                    {/* Vertical line from horizontal line to right child */}
                    <div className="w-[2px] h-6 bg-green-700"></div>
                    <TreeView
                      data={data.right!}
                      onNodeDoubleClick={onNodeDoubleClick}
                      level={level + 1}
                    />
                  </div>
                )}
              </div>
            </>
          )}
        </li>
      </ul>
    </div>
  );
};

export default TreeView;
