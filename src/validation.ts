import { Elysia, t } from "elysia";
import { openapi } from "@elysiajs/openapi";

const app = new Elysia()
  .use(openapi())

  .onError(({ code, error, set }) => {
    if (code === "VALIDATION") {
      set.status = 400;
      return {
        success: false,
        error: "Validation Error",
      };
    }
    if (code === "NOT_FOUND") {
      set.status = 404;
      return { message: "Route not found" };
    }
    set.status = 500;
    return { message: "Internal Server Error" };
  })

  .onAfterHandle(({ response }) => {
    if (response && typeof response === 'object' && 'success' in response) {
      return response;
    }
    return {
      success: true,
      Message: "data tersedia",
      data: response
    };
  })

  .post("/request", ({ body }) => body, {
    body: t.Object({
      name: t.String({ minLength: 3 }),
      email: t.String({ format: "email" }),
      age: t.Number({ minimum: 18 })
    })
  })

  .get('/products/:id', ({ params, query }) => {
    return {
      id: params.id,
      sort: query.sort,
      status: "success",
      timestamp: Date.now()
    };
  }, {
    params: t.Object({ id: t.Numeric() }), 
    query: t.Object({ sort: t.String({ enum: ["asc", "desc"] }) })
  })

  .get('/stats', () => ({ total: 100, active: 75 }))

  .get("/admin", () => ({ stats: 99 }), {
    beforeHandle({ headers, set }) {
      if (headers.authorization !== "Bearer 123") {
        set.status = 401;
        return {
          success: false,
          message: "Unauthorized"
        };
      }
    }
  })

  .get("/product", () => ({ id: 1, name: "Laptop" }))

  .post("/login", ({ body }) => body, {
    body: t.Object({
      email: t.String({ format: "email" }),
      password: t.String({ minLength: 8 })
    })
  })

  .listen(3000);

console.log(`🦊 Elysia running at http://localhost:3000`);


//SEBELUM PERBAIKAN
// import { Elysia, t } from "elysia";
// import { openapi } from "@elysiajs/openapi";

// const app = new Elysia()
//   .use(openapi())
//   .post("/request",
//     ({ body }) => {
//       return {
//         message: "Success",
//         data: body
//       }
//     },
//     {
//       body: t.Object({
//         name: t.String({ minLength: 3 }),
//         email: t.String({ format: "email" }),
//         age: t.Number({ minimum: 18 })
//       })
//     }
//   )
//   .listen(3000);


// console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);


// app.onAfterHandle(({ response }: { response: unknown }) => {
//     return {
//       success: true,
//       Message: "data tersedia",
//       data: response
//     }
//   })

//   app.onError(({ code, error, set }) => {
//     if (code === "VALIDATION") {
//       set.status = 400
//       return {
//         success: false,
//         error: "Validation Error", 
//       }
//     }

//     if (code === "NOT_FOUND") {
//       set.status = 404
//       return {
//         message: "Route not found"
//       }
//     }

//     set.status = 500
//     return {
//       message: "Internal Server Error"
//     }
//   })
  
// app.get(
//     '/products/:id', 
//     ({ params, query }) => {
//       return {
//         id: params.id,
//         sort: query.sort,
//         status: "success",
//         timestamp: Date.now()
//       }
//     }, 
//     {
//       params: t.Object({
//         id: t.Number()
//       }),

//       query: t.Object({
//         sort: t.String({ enum: ["asc", "desc"] })
//       }),

//       response: t.Object({
//         id: t.Number(),
//         sort: t.String(),
//         status: t.String(),
//         timestamp: t.Number()
//       })
//     }
//   )

// app.get(
//     '/stats',
//     () => {
//       return {
//         total: 100,
//         active: 75
//       }
//     },
//     {
//       response: t.Object({
//         total: t.Number(),
//         active: t.Number()
//       })
//     }
//   )

// app.get(
//     "/admin",
//     () => ({
//       stats: 99
//     }),
//     {
//       response: t.Object({
//         stats: t.Number()
//       }), 
      
//       beforeHandle({ headers, set }) {
//         if (headers.authorization !== "Bearer 123") {
//           set.status = 401
//           return {
//             success: false,
//             message: "Unauthorized"
//           }
//         }
//       }
//     }
//   )


// app.get("/product", () => {
//     return { id: 1, name: "Laptop" }
//   }, {
//     response: t.Object({
//       success: t.Boolean(),
//       Message: t.String(),
//       data: t.Object({
//         id: t.Number(),
//         name: t.String()
//       })
//     })
//   })


// app.post(
//     "/login",
//     ({ body }) => body,
//     {
//       body: t.Object({
//         email: t.String({ format: "email" }),
//         password: t.String({ minLength: 8 }) 
//       })
//     }
//   )


