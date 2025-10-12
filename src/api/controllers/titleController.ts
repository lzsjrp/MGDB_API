import prisma from "../lib/prisma.js";

export const createTitle = async (req, res) => {
	try {
		if (!req.body.title || !req.body.author || !req.body.type) {
			return res.status(400).json({ error: "Title, author and type are required" });
		}
		if (req.body.type !== "MANGA" && req.body.type !== "WEB_NOVEL") {
			return res.status(400).json({ error: "Invalid type. Must be 'MANGA' or 'WEB_NOVEL'" });
		}
		const newBook = await prisma.book.create({
			data: {
				title: req.body.title,
				author: req.body.author,
				description: req.body.description || "",
				genre: req.body.genre || [],
				addedBy: req.session.userId,
				type: req.body.type,
				status: req.body.status || "Ongoing",
			},
		});
		res.status(201).json({ id: newBook.id, message: "Title created successfully", book: newBook });
	} catch (error) {
		res.status(500).json({ error: "Failed to create title", errorDetails: error.message });
	}
}

export const getTitle = async (req, res) => {
	const { titleId } = req.params;
	const { include = '', exclude = '' } = req.query;

	const includes = include.split(',').map((s: string) => s.trim().toLowerCase());
	const excludes = exclude.split(',').map((s: string) => s.trim().toLowerCase());

	const includeObject = {
		cover: !excludes.includes('cover'),
		volumes: includes.includes('volumes') && !excludes.includes('volumes'),
	};

	try {
		const book = await prisma.book.findUnique({
			where: { id: titleId },
			include: includeObject,
		});
		if (!book) {
			return res.status(404).json({ error: "Title not found" });
		}
		return res.status(200).json({ id: book.id, book });
	} catch (error) {
		res.status(500).json({ error: "Failed to retrieve title", errorDetails: error.message });
	}
}

export const getTitleList = async (req, res) => {
	const { page = '1', sortBy = 'recent', search, type, author, genres, addedAfter, addedBefore } = req.query;

	const pageNumber = parseInt(page, 10);
	const pageSize = 10;

	if (isNaN(pageNumber) || pageNumber < 1) {
		return res.status(400).json({ error: 'Page number is invalid' });
	}

	let orderByClause;

	switch (sortBy) {
		case 'title':
			orderByClause = { title: 'asc' };
			break;
		case 'updated':
			orderByClause = { updatedAt: 'desc' };
			break;
		default:
			orderByClause = { createdAt: 'desc' };
	}

	const filters = {
		AND: [],
	};

	const filterDate = {} as { gte?: Date; lte?: Date };

	if (addedAfter) {
		const afterDate = new Date(addedAfter);
		if (!isNaN(afterDate.getTime())) filterDate.gte = afterDate;
	}
	if (addedBefore) {
		const beforeDate = new Date(addedBefore);
		if (!isNaN(beforeDate.getTime())) filterDate.lte = beforeDate;
	}
	if (Object.keys(filterDate).length > 0) {
		filters.AND.push({ createdAt: filterDate });
	}

	if (Object.keys(filterDate).length > 0) {
		filters.AND.push({ createdAt: filterDate });
	}

	if (search) {
		filters.AND.push({ title: { contains: search, mode: 'insensitive' } });
	}

	if (type) {
		filters.AND.push({ type: type });
	}

	if (author) {
		filters.AND.push({ author: { contains: author, mode: 'insensitive' } });
	}

	if (genres) {
		let genresArray = [];
		if (typeof genres === 'string') {
			genresArray = genres.split(',').map(g => g.trim());
		} else if (Array.isArray(genres)) {
			genresArray = genres;
		}
		if (genresArray.length > 0) {
			filters.AND.push({
				genre: {
					hasSome: genresArray,
				},
			});
		}
	}

	const whereFilter = filters.AND.length > 0 ? { AND: filters.AND } : {};

	try {
		const books = await prisma.book.findMany({
			where: whereFilter,
			skip: (pageNumber - 1) * pageSize,
			take: pageSize,
			include: { volumes: true, cover: true },
			orderBy: orderByClause,
		});

		const total = await prisma.book.count({ where: whereFilter });

		const totalPages = Math.ceil(total / pageSize);

		return res.status(200).json({
			page: pageNumber,
			pageSize,
			total,
			totalPages,
			data: books,
		});
	} catch (error) {
		return res.status(500).json({ error: 'Failed to retrieve titles', errorDetails: error.message });
	}
};


export const deleteTitle = async (req, res) => {
	const { titleId } = req.params;
	try {
		const book = await prisma.book.findUnique({ where: { id: titleId } });
		if (!book) {
			return res.status(404).json({ error: "Title not found" });
		}
		if (book.addedBy !== req.session.userId) {
			return res.status(403).json({ error: "You do not have permission to delete this web novel" });
		}
		await prisma.book.delete({ where: { id: titleId } });
		res.status(200).json({ id: titleId, message: "Title deleted successfully", book });
	} catch (error) {
		res.status(500).json({ error: "Failed to delete title", errorDetails: error.message });
	}
}

export const updateTitle = async (req, res) => {
	const { titleId } = req.params;
	try {
		const book = await prisma.book.findUnique({ where: { id: titleId } });
		if (!book) {
			return res.status(404).json({ error: "Title not found" });
		}
		if (book.addedBy !== req.session.userId) {
			return res.status(403).json({ error: "You do not have permission to update this web novel" });
		}
		const updatedBook = await prisma.book.update({
			where: { id: titleId },
			data: {
				title: req.body.title || book.title,
				author: req.body.author || book.author,
				description: req.body.description || book.description,
				genre: req.body.genre || book.genre,
				type: req.body.type || book.type,
				status: req.body.status || book.status,
			},
		});
		res.status(200).json({ id: book.id, message: "Title updated successfully", book: updatedBook });
	} catch (error) {
		res.status(500).json({ error: "Failed to update title", errorDetails: error.message });
	}
}

export const addFavorite = async (req, res) => {
	const { titleId } = req.body;
	try {
		const existing = await prisma.userFavorites.findUnique({
			where: {
				userId_bookId: {
					userId: req.session.userId,
					bookId: titleId,
				}
			}
		});
		if (existing) {
			return res.status(409).json({ error: 'Book already favorited by this user' });
		}
		await prisma.userFavorites.create({
			data: {
				userId: req.session.userId,
				bookId: titleId,
			}
		});
		res.status(201).json({ message: 'Favorite added successfully' });
	} catch (error) {
		res.status(500).json({ error: 'Failed to add favorite', errorDetails: error.message });
	}
};

export const syncFavorites = async (req, res) => {
	const { booksIds } = req.body;

	if (!Array.isArray(booksIds) || booksIds.length === 0) {
		return res.status(400).json({ error: 'booksIds must be a non-empty array' });
	}

	try {
		const existingFavorites = await prisma.userFavorites.findMany({
			where: {
				userId: req.session.userId,
				bookId: { in: booksIds },
			},
			select: { bookId: true },
		});

		const existingBookIds = new Set(existingFavorites.map(fav => fav.bookId));

		const booksToAdd = booksIds.filter(id => !existingBookIds.has(id));

		const createdFavorites = [];
		for (const bookId of booksToAdd) {
			const created = await prisma.userFavorites.create({
				data: { userId: req.session.userId, bookId },
			});
			createdFavorites.push(created);
		}

		res.status(200).json({
			message: 'Favorites synced successfully',
			added: booksToAdd.length,
			alreadyExist: existingBookIds.size,
		});
	} catch (error) {
		res.status(500).json({ error: 'Failed to sync favorites', errorDetails: error.message });
	}
};
