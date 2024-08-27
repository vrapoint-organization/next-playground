import React from "react";

interface TreeNodeProps {
  data: any;
  depth?: number;
}

const TreeNode: React.FC<TreeNodeProps> = ({ data, depth = 0 }) => {
  // Generate indentation based on depth
  const indentationStyle = {
    paddingLeft: `${depth * 20}px`,
  };

  if (typeof data !== "object" || data === null) {
    // If it's a primitive value, just display it
    return <div style={indentationStyle}>{String(data)}</div>;
  }

  return (
    <div>
      {Object.entries(data).map(([key, value]) => (
        <div key={key}>
          <div style={indentationStyle}>
            <strong>{key}:</strong>
          </div>
          {/* Recursively render the child nodes */}
          <TreeNode data={value} depth={depth + 1} />
        </div>
      ))}
    </div>
  );
};

interface ObjectViewerProps {
  objectData: object;
}

const ObjectViewer: React.FC<ObjectViewerProps> = ({ objectData }) => {
  return (
    <div>
      <TreeNode data={objectData} />
    </div>
  );
};

export default ObjectViewer;
