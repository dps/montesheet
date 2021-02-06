import { apiRequest } from "./util";

function submit(data) {
  return apiRequest("contact", "POST", data);
}

const contact = { submit };

export default contact;
