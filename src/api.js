import { getAccessToken } from "./access-token.js";
import { response as schema } from "./schemas.js";
import { toast } from "./ui.js";
import { safe } from "./util.js";

export const request = async (message) => {
  const token = await getAccessToken();

  const req = await safe(() =>
    fetch("https://lullaby.oniryk.services/validate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ message }),
    }),
  );

  if (!req.ok) {
    const message = "failed to make request to the API: " + req.error.message;
    toast.error({ title: "api error", message });
    process.exit(1);
  }

  const response = await safe(() => req.result.json());

  if (!response.ok) {
    const message = "failed to parse API response: " + response.error.message;
    toast.error({ title: "api error", message });
    process.exit(1);
  }

  const parseResult = schema.safeParse(response.result);

  if (!parseResult.success) {
    const message = "response schema is not valid";
    toast.error({ title: "schema validation error", message });
    process.exit(1);
  }

  return parseResult.data;
};
