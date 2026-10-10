#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/d5a4c082d22f55a7125263406e028c867f2f521a6ec324961a932347617ed596/contract';
import endContract from '../../snapshots/d5a4c082d22f55a7125263406e028c867f2f521a6ec324961a932347617ed596/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/e52af813cfb14dabccea6a5544aa1689d8393496d5357e5c3d37ce0944c06065/contract';
import startContract from '../../snapshots/e52af813cfb14dabccea6a5544aa1689d8393496d5357e5c3d37ce0944c06065/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.dropColumn({ schema: 'public', table: 'Notification', column: 'relatedPostId' }),
      this.dropTable({ schema: 'public', table: 'Post' }),
      this.addColumn({
        schema: 'public',
        table: 'Notification',
        column: col('relatedItemId', 'character(36)', {
          codecRef: { codecId: 'sql/char@1', typeParams: { length: 36 } },
        }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'User',
        column: col('about', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'User',
        column: col('profilePublicId', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'User',
        column: col('profileUrl', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
