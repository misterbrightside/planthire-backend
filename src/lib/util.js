import bcrypt from 'bcrypt';

export function toRes(res, status=200) {
	return (err, thing) => {
		if (err) return res.status(500).send(err);

		if (thing && typeof thing.toObject==='function') {
			thing = thing.toObject();
		}
		res.status(status).json(thing);
	};
}

export function getPasswordHash(value) {
  return new Promise((resolve, reject) => {
    bcrypt.hash(value, 10, function(error, hashedValue) {
      resolve(hashedValue);
    });
  });
}