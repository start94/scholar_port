// tests/articles.test.js
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const Article = require('../models/Article');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await Article.deleteMany({});
});

describe('Articles API', () => {
  let article;

  beforeEach(async () => {
    
    article = await Article.create({
      title: 'Test Article',
      authors: ['Author 1'],
      abstract: 'This is a sufficiently long abstract for testing purposes, ensuring it passes the fifty-character validation rule.',
      doi: '10.1234/test.doi.1',
      publicationDate: '2023-01-01',
    });
  });

  it('POST /api/articles - should create a new article', async () => {
    
    const newArticle = {
      title: 'New Article',
      authors: ['Author 2'],
      abstract: 'This is another long and detailed abstract for the new article, created specifically to pass the validation checks.',
      doi: '10.1234/test.doi.2',
      publicationDate: '2023-02-01',
    };
    const res = await request(app).post('/api/articles').send(newArticle).expect(201);
    expect(res.body.success).toBe(true);
  });

  it('GET /api/articles - should return all articles', async () => {
    const res = await request(app).get('/api/articles').expect(200);
    expect(res.body.data.length).toBe(1);
  });

  it('GET /api/articles/:id - should return a single article', async () => {
    const res = await request(app).get(`/api/articles/${article.id}`).expect(200);
    expect(res.body.data.title).toBe('Test Article');
  });

  it('PUT /api/articles/:id - should update an article', async () => {
    
    const update = {
      title: 'Updated Title',
      authors: ['Updated Author'],
      abstract: 'The abstract has been updated with this new text, which is also carefully crafted to be longer than fifty characters.',
      doi: '10.1234/test.doi.1.updated',
      publicationDate: '2024-01-01',
    };
    const res = await request(app).put(`/api/articles/${article.id}`).send(update).expect(200);
    expect(res.body.data.title).toBe('Updated Title');
  });

  it('DELETE /api/articles/:id - should delete an article', async () => {
    await request(app).delete(`/api/articles/${article.id}`).expect(200);
    const foundArticle = await Article.findById(article.id);
    expect(foundArticle).toBeNull();
  });
});