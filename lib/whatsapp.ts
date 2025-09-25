import "server-only";

export const sendMessage = async ({
  text,
  type,
  number,
  imageUrl,
}: {
  text: string;
  type: "text" | "image";
  number: string;
  imageUrl?: string;
}) => {
  try {
    console.log("sendWa", text, type, number, imageUrl);
    const res = await fetch("/notify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type,
        message: text,
        number,
        image: imageUrl || "",
      }),
    });

    const responseText = await res.text();
    console.log("Response:", responseText);
  } catch (error) {
    console.error("Error sending message:", error);
  }
};
