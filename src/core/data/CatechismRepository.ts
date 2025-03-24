// /core/data/CatechismRepository.ts
import { Pool } from 'pg';

export interface CreateCatechismDTO {
  bookName: string;
  authorName: string;
  title: string;
  description: string;
  tags?: string;
}

export interface UpdateCatechismDTO {
  bookName?: string;
  authorName?: string;
  title?: string;
  description?: string;
  tags?: string;
}

export class CatechismRepository {
  constructor(private db: Pool) {}

  async createCatechism(data: CreateCatechismDTO) {
    const query = `
      INSERT INTO catechisms (book_name, author_name, title, description, tags)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, book_name, author_name, title
    `;
    const result = await this.db.query(query, [
      data.bookName,
      data.authorName,
      data.title,
      data.description,
      data.tags
    ]);
    return result.rows[0];
  }

  async getAllCatechisms() {
    const query = `SELECT * FROM catechisms ORDER BY id DESC`;
    const { rows } = await this.db.query(query);
    return rows;
  }

  async getCatechismById(id: number) {
    const query = `SELECT * FROM catechisms WHERE id = $1`;
    const { rows } = await this.db.query(query, [id]);
    return rows[0] || null;
  }

  async updateCatechism(id: number, data: UpdateCatechismDTO) {
    // Build dynamic query based on provided fields
    const updates = [];
    const values = [];
    let paramIndex = 1;

    if (data.bookName !== undefined) {
      updates.push(`book_name = $${paramIndex}`);
      values.push(data.bookName);
      paramIndex++;
    }

    if (data.authorName !== undefined) {
      updates.push(`author_name = $${paramIndex}`);
      values.push(data.authorName);
      paramIndex++;
    }

    if (data.title !== undefined) {
      updates.push(`title = $${paramIndex}`);
      values.push(data.title);
      paramIndex++;
    }

    if (data.description !== undefined) {
      updates.push(`description = $${paramIndex}`);
      values.push(data.description);
      paramIndex++;
    }

    if (data.tags !== undefined) {
      updates.push(`tags = $${paramIndex}`);
      values.push(data.tags);
      paramIndex++;
    }

    // If no updates, return null
    if (updates.length === 0) {
      return null;
    }

    const query = `
      UPDATE catechisms 
      SET ${updates.join(', ')}, updated_at = NOW()
      WHERE id = $${paramIndex}
      RETURNING id, book_name, author_name, title
    `;
    values.push(id);

    const { rows } = await this.db.query(query, values);
    return rows[0] || null;
  }

  async deleteCatechism(id: number) {
    const query = `
      DELETE FROM catechisms 
      WHERE id = $1
      RETURNING id
    `;
    const { rows } = await this.db.query(query, [id]);
    return rows.length > 0;
  }

  async searchCatechisms(searchTerm: string) {
    const query = `
      SELECT * FROM catechisms 
      WHERE 
        book_name ILIKE $1 OR 
        author_name ILIKE $1 OR 
        title ILIKE $1 OR
        description ILIKE $1 OR
        tags ILIKE $1
      ORDER BY id DESC
    `;
    const { rows } = await this.db.query(query, [`%${searchTerm}%`]);
    return rows;
  }
}
