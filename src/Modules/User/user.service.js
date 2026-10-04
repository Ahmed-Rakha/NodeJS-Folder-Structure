import { DB } from "../../DB/connection.db.js";

export const getUsers = async (inputs) => {
  const {
    limit,
    page,
    role,
    isActive,
    minSalary,
    maxSalary,
    minAge,
    maxAge,
    city,
    sort,
  } = inputs;
  const filter = {};
  let sortFields = {};
  const pageSize = parseInt(limit) || 10;
  const currentPage = parseInt(page) || 1;

  const skip = (currentPage - 1) * pageSize;

  if (role) {
    if (Array.isArray(role)) {
      filter.role = { $in: role };
    } else if (
      typeof role === "string" &&
      role.trim() !== "" &&
      role.includes(",")
    ) {
      filter.role = { $in: role.split(",") };
    } else {
      filter.role = undefined; // If role is not a valid string or array, set it to undefined
    }
  }
  if (
    isActive !== undefined &&
    isActive !== null &&
    isActive !== "" &&
    (isActive === "true" || isActive == 1)
  ) {
    filter.isActive = true;
  }
  if (minSalary !== undefined || maxSalary !== undefined) {
    filter.salary = {};
    if (minSalary !== undefined) {
      filter.salary.$gte = isNaN(parseFloat(minSalary))
        ? undefined
        : parseFloat(minSalary); // Convert minSalary to a number
    }
    if (maxSalary !== undefined) {
      filter.salary.$lte = isNaN(parseFloat(maxSalary))
        ? undefined
        : parseFloat(maxSalary); // Convert maxSalary to a number
    }
  }
  if (minAge !== undefined || maxAge !== undefined) {
    filter.age = {};
    if (minAge !== undefined) {
      filter.age.$gte = isNaN(parseInt(minAge)) ? undefined : parseInt(minAge); // Convert minAge to a number
    }
    if (maxAge !== undefined) {
      filter.age.$lte = isNaN(parseInt(maxAge)) ? undefined : parseInt(maxAge); // Convert maxAge to a number
    }
  }
  if (city) {
    if (Array.isArray(city)) {
      filter.city = { $in: city };
    } else if (
      typeof city === "string" &&
      city.trim() !== "" &&
      city.includes(",")
    ) {
      filter.city = { $in: city.split(",") };
    } else {
      filter.city = undefined; // If city is not a valid string or array, set it to undefined
    }
  }
  if (sort) {
    // console.log({ sort });
    console.log("My Sort Data Is Array", Array.isArray(sort));
    if (typeof sort === "string" && sort.trim() !== "" && sort.includes(",")) {
      sortFields = sort.split(",").reduce((acc, field) => {
        const [key, order] = field.split(":");
        acc[key] = order === "desc" ? -1 : 1;
        console.log({ acc });
        return acc;
      }, {});
    } else if (Array.isArray(sort)) {
      console.log("Sorting Started at Array Level...");
      sortFields = sort.reduce((acc, field) => {
        const [key, order] = field.split(":");
        acc[key] = order === "desc" ? -1 : 1;
        console.log({ acc });
        return acc;
      }, {});
    }
  }

  console.log("My Filter Data ", filter);
  console.log("My sort Data ", sortFields);
  const users = await DB.collection("users")
    .find(filter)
    .skip(skip)
    .limit(pageSize)
    .sort(Object.keys(sortFields).length > 0 ? sortFields : { salary: -1 })
    .toArray();
  const totalUsers = await DB.collection("users").countDocuments(filter);
  console.log(users);
  return {
    users,
    pagination: {
      total: totalUsers,
      pageSize,
      currentPage,
      totalPages: Math.ceil(totalUsers / pageSize),
      hasPreviousPage: currentPage > 1,
      hasNextPage: currentPage < Math.ceil(totalUsers / pageSize),
      previousPage: currentPage > 1 ? currentPage - 1 : null,
      nextPage:
        currentPage < Math.ceil(totalUsers / pageSize) ? currentPage + 1 : null,
    },
  };
};

export const updateUser = async (id, inputs) => {
  const allowedFields = ["name", "age", "salary", "city", "role"];
  const updateData = {};

  for (const field of allowedFields) {
    if (inputs[field] !== undefined) {
      updateData[field] = inputs[field];
    }
  }

  if (Object.keys(updateData).length === 0) {
    throw new Error("No valid fields provided for update.");
  }

  const updatedUser = await DB.collection("users").updateOne(
    { _id: id },
    { $set: updateData },
  );

  return updatedUser;
};
