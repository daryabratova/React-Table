const faker = require("faker");
const fs = require("fs");

const header = {
  firstName: "First name",
  lastName: "Last name",
  job: "Job",
  phone: "Phone",
};

const records = Array(500)
  .fill(null)
  .map(() => {
    const gender = Math.floor(Math.random() * 2);

    const firstName = faker.name.firstName(gender);
    const lastName = faker.name.lastName(gender);
    const job = faker.name.jobType();
    const phone = faker.phone.phoneNumber("(###) ###-####");

    return {
      firstName,
      lastName,
      job,
      phone,
    };
  });

const order = ["firstName", "lastName", "job", "phone"];

const data = {
  header,
  records,
  order,
};

fs.writeFileSync("table-data.json", JSON.stringify(data));
