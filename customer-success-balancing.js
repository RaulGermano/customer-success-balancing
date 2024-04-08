/**
 * Returns the id of the CustomerSuccess with the most customers
 * @param {array} customerSuccess
 * @param {array} customers
 * @param {array} customerSuccessAway
 */

const customersSuccessQuantityLimit = 1000;
const customerSuccessScoreLimit = 10000;
const customersQuantityLimit = 1000000;
const customerScoreLimit = 100000;

function customerSuccessBalancing(
	customerSuccess,
	customers,
	customerSuccessAway
) {
	if (customerSuccessAway.length > customerSuccess.length / 2) {
		throw new Error(
			'The number of customers success is lower than necessary'
		);
	}

	validateParameterLimits(
		customers,
		customersQuantityLimit,
		customerScoreLimit,
		'customers'
	);

	validateParameterLimits(
		customerSuccess,
		customersSuccessQuantityLimit,
		customerSuccessScoreLimit,
		'customers success'
	);

	let allowedCS = [];
	for (const cs of customerSuccess) {
		if (!customerSuccessAway.includes(cs.id)) {
			allowedCS.push({ ...cs, actions: 0 });
		}
	}
	const processedCustomerSuccess = allowedCS.sort(
		(current, next) => current.score - next.score
	);

	let maxActions = 0;
	let cssTopRanked = [];
	for (const customer of customers) {
		for (const cs of processedCustomerSuccess) {
			if (customer.score <= cs.score) {
				cs.actions++;

				if (cs.actions > maxActions) {
					cssTopRanked = [cs];
					maxActions = cs.actions;
				} else if (cs.actions === maxActions) {
					cssTopRanked.push(cs);
				}

				break;
			}
		}
	}

	return cssTopRanked.length === 1 ? cssTopRanked[0].id : 0;
}

function validateParameterLimits(
	entityParameter,
	toleranceQuantity,
	toleranceScore,
	entityType
) {
	if (entityParameter.length >= toleranceQuantity) {
		throw new Error(
			`The ${entityType} parameter has exceeded the permitted quantity limit of ${toleranceQuantity}`
		);
	} else if (entityParameter.some((item) => item.score >= toleranceScore)) {
		throw new Error(
			`The ${entityType} parameter has exceeded the permitted score limit of ${toleranceScore}`
		);
	}

	return entityParameter;
}

test('Scenario 1', () => {
	const css = [
		{ id: 1, score: 60 },
		{ id: 2, score: 20 },
		{ id: 3, score: 95 },
		{ id: 4, score: 75 },
	];
	const customers = [
		{ id: 1, score: 90 },
		{ id: 2, score: 20 },
		{ id: 3, score: 70 },
		{ id: 4, score: 40 },
		{ id: 5, score: 60 },
		{ id: 6, score: 10 },
	];
	const csAway = [2, 4];

	expect(customerSuccessBalancing(css, customers, csAway)).toEqual(1);
});

function buildSizeEntities(size, score) {
	const result = [];
	for (let i = 0; i < size; i += 1) {
		result.push({ id: i + 1, score });
	}
	return result;
}

function mapEntities(arr) {
	return arr.map((item, index) => ({
		id: index + 1,
		score: item,
	}));
}

function arraySeq(count, startAt) {
	return Array.apply(0, Array(count)).map((it, index) => index + startAt);
}

test('Scenario 2', () => {
	const css = mapEntities([11, 21, 31, 3, 4, 5]);
	const customers = mapEntities([10, 10, 10, 20, 20, 30, 30, 30, 20, 60]);
	const csAway = [];

	expect(customerSuccessBalancing(css, customers, csAway)).toEqual(0);
});

test('Scenario 3', () => {
	const testTimeoutInMs = 100;
	const testStartTime = new Date().getTime();

	const css = mapEntities(arraySeq(999, 1));
	const customers = buildSizeEntities(10000, 998);
	const csAway = [999];

	expect(customerSuccessBalancing(css, customers, csAway)).toEqual(998);

	if (new Date().getTime() - testStartTime > testTimeoutInMs) {
		throw new Error(`Test took longer than ${testTimeoutInMs}ms!`);
	}
});

test('Scenario 4', () => {
	const css = mapEntities([1, 2, 3, 4, 5, 6]);
	const customers = mapEntities([10, 10, 10, 20, 20, 30, 30, 30, 20, 60]);
	const csAway = [];

	expect(customerSuccessBalancing(css, customers, csAway)).toEqual(0);
});

test('Scenario 5', () => {
	const css = mapEntities([100, 2, 3, 6, 4, 5]);
	const customers = mapEntities([10, 10, 10, 20, 20, 30, 30, 30, 20, 60]);
	const csAway = [];

	expect(customerSuccessBalancing(css, customers, csAway)).toEqual(1);
});

test('Scenario 6', () => {
	const css = mapEntities([100, 99, 88, 3, 4, 5]);
	const customers = mapEntities([10, 10, 10, 20, 20, 30, 30, 30, 20, 60]);
	const csAway = [1, 3, 2];

	expect(customerSuccessBalancing(css, customers, csAway)).toEqual(0);
});

test('Scenario 7', () => {
	const css = mapEntities([100, 99, 88, 3, 4, 5]);
	const customers = mapEntities([10, 10, 10, 20, 20, 30, 30, 30, 20, 60]);
	const csAway = [4, 5, 6];

	expect(customerSuccessBalancing(css, customers, csAway)).toEqual(3);
});

test('Scenario 8', () => {
	const css = mapEntities([60, 40, 95, 75]);
	const customers = mapEntities([90, 70, 20, 40, 60, 10]);
	const csAway = [2, 4];
	expect(customerSuccessBalancing(css, customers, csAway)).toEqual(1);
});

/////////////////////////////////// Other tests ///////////////////////////////////

function generateSequentialArray(size) {
	const result = [];

	for (let i = 1; i <= size; i++) {
		const randomNumber = Math.floor(Math.random() * 9) + 1;
		result.push({ id: i, score: randomNumber * 10 });
	}
	return result;
}

describe('Error tests', () => {
	test('Scenario 9', () => {
		const css = mapEntities(arraySeq(1000, 1));
		const customers = mapEntities([90, 70]);
		const csAway = [2, 4];

		const testFunction = () => {
			customerSuccessBalancing(css, customers, csAway);
		};

		expect(testFunction).toThrowError(
			`The customers success parameter has exceeded the permitted quantity limit of ${customersSuccessQuantityLimit}`
		);
	});

	test('Scenario 10', () => {
		const css = mapEntities([60, 40, 95, 75]);
		const customers = generateSequentialArray(1000000);
		const csAway = [];

		const testFunction = () => {
			customerSuccessBalancing(css, customers, csAway);
		};

		expect(testFunction).toThrowError(
			`The customers parameter has exceeded the permitted quantity limit of ${customersQuantityLimit}`
		);
	});

	test('Scenario 11', () => {
		const css = mapEntities(arraySeq(999, 9002));
		const customers = mapEntities([90, 70]);
		const csAway = [];

		const testFunction = () => {
			customerSuccessBalancing(css, customers, csAway);
		};

		expect(testFunction).toThrowError(
			`The customers success parameter has exceeded the permitted score limit of ${customerSuccessScoreLimit}`
		);
	});

	test('Scenario 12', () => {
		const css = mapEntities([90, 70, 60, 20]);
		const customers = mapEntities(arraySeq(100000, 1));
		const csAway = [];

		const testFunction = () => {
			customerSuccessBalancing(css, customers, csAway);
		};

		expect(testFunction).toThrowError(
			`The customers parameter has exceeded the permitted score limit of ${customerScoreLimit}`
		);
	});

	test('Scenario 13', () => {
		const css = mapEntities([10, 20, 30, 40, 50]);
		const customers = mapEntities([5, 10, 15, 20, 25, 30, 35, 40, 45, 50]);
		const csAway = [10, 30, 50];

		const testFunction = () => {
			customerSuccessBalancing(css, customers, csAway);
		};

		expect(testFunction).toThrowError(
			'The number of customers success is lower than necessary'
		);
	});
});
