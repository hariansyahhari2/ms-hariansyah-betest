const express = require('express');

const { userSchema } = require('../schemas');
const { userService } = require('../services');
const {
  authMiddleware,
  schemaValidation,
  createHandler,
  cacheMiddleware,
  invalidateCacheMiddleware
} = require('../middlewares');
const userServices = require("../services/userService");

const router = express.Router();

router.get(
  '/user/all',
  authMiddleware,
  cacheMiddleware('/user/all'),
  createHandler(userService.getAll)
);

router.get(
  '/user',
  authMiddleware,
  cacheMiddleware(),
  createHandler(userService.getMyInfo)
);

router.get(
  '/user/accountNumber/:accountNumber',
  authMiddleware,
  cacheMiddleware(),
  createHandler(userService.getByAccountNumber)
);

router.get(
  '/user/identityNumber/:identityNumber',
  authMiddleware,
  cacheMiddleware(),
  createHandler(userService.getByIdentityNumber)
);

router.post(
  '/user',
  schemaValidation({ body: userSchema.registerUserSchema }),
  invalidateCacheMiddleware(['/user/all']),
  createHandler(userService.register)
);

router.patch(
  '/user',
  schemaValidation({ body: userSchema.updateUserSchema }),
  authMiddleware,
  invalidateCacheMiddleware(['/user/all']),
  createHandler(userService.update)
);

router.delete(
  '/user/:userName',
  authMiddleware,
  invalidateCacheMiddleware(['/user/all']),
  createHandler(userService.deleteUser)
);

router.post(
  '/authenticate',
  userServices.authenticate
);

module.exports = router;
