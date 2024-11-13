export const sendMoveToServer = async (move) => {
  try {
    const response = await fetch(`/api/games/${initialGame.id}/move`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ move, playerId: currentPlayer.id }),
    });

    if (!response.ok) {
      const error = await response.text();
      toast.error(`Move failed: ${error}`);
      return;
    }
    toast.success("move success");
  } catch (error) {
    console.error("Failed to send move:", error);
    toast.error("Network error. Please try again.");
  }
};
