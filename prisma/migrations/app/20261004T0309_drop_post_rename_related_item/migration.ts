#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/3a78d7732672f8d3b460a639cff2796c0f94c2f5f0b2cc93d983e2a2541c5387/contract';
import endContract from '../../snapshots/3a78d7732672f8d3b460a639cff2796c0f94c2f5f0b2cc93d983e2a2541c5387/contract.json' with { type: 'json' };
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
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
