export const formatUserSpacesData = (nodes = []) => {
  // Nodes is an array containing all the nodes in a path
  // First node is the user object.
  // Rest of the nodes are the reading spaces

  let spaces = [];
  for (const node of nodes) {
    spaces.push(node._fields[0].properties);
  }
  return spaces;
};
