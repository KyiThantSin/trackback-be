#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/4833cac09bda36a62841a2fbedce99f22d7bd4a0d603b4a43bcfbc3d22bf6e3c/contract';
import endContract from '../../snapshots/4833cac09bda36a62841a2fbedce99f22d7bd4a0d603b4a43bcfbc3d22bf6e3c/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/4d88c8463efcd799e4f2a83bb4f31e0bfab58f937d1b05dc13818e0a1399fb11/contract';
import startContract from '../../snapshots/4d88c8463efcd799e4f2a83bb4f31e0bfab58f937d1b05dc13818e0a1399fb11/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, primaryKey } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createTable({
        schema: 'public',
        table: 'LostItemPost',
        columns: [
          col('category', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('description', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'character(36)', {
            notNull: true,
            codecRef: { codecId: 'sql/char@1', typeParams: { length: 36 } },
          }),
          col('lastSeenDate', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('lastSeenLocation', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('photoUrl', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('status', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('title', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('userId', 'character(36)', {
            notNull: true,
            codecRef: { codecId: 'sql/char@1', typeParams: { length: 36 } },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
