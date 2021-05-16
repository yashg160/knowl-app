export const updateUserSpaces = async (changeUserSpaces, selected) => {
  try {
    console.log("selected", selected);
    const result = await changeUserSpaces({
      variables: { spaceIds: selected },
    });
    console.log("actual result", result);
    if (result.data.changeUserSpaces.error) {
      throw Error(result.data.changeUserSpaces.error.message);
    }

    if (result.data.changeUserSpaces.status !== "OK") {
      throw Error("Could not save your settings");
    }

    return result.data.changeUserSpaces;
  } catch (error) {
    console.log(error);
    return {
      error: {
        message: "Could not save your settings",
      },
    };
  }
};
