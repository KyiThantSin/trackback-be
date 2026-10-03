#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/05649fecaff940e4c6707d66bf5693bb797c42f5a5ba8ecde5db03317113c792/contract';
import startContract from '../../snapshots/05649fecaff940e4c6707d66bf5693bb797c42f5a5ba8ecde5db03317113c792/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/4d88c8463efcd799e4f2a83bb4f31e0bfab58f937d1b05dc13818e0a1399fb11/contract';
import endContract from '../../snapshots/4d88c8463efcd799e4f2a83bb4f31e0bfab58f937d1b05dc13818e0a1399fb11/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.dropColumn({ schema: 'public', table: 'Notification', column: 'referenceId' }),
      this.dropColumn({ schema: 'public', table: 'Notification', column: 'type' }),
      this.dropColumn({ schema: 'public', table: 'Notification', column: 'updatedAt' }),
      this.addColumn({
        schema: 'public',
        table: 'Notification',
        column: col('relatedPostId', 'character(36)', {
          codecRef: { codecId: 'sql/char@1', typeParams: { length: 36 } },
        }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'Notification',
        column: col('isRead', 'bool', {
          notNull: true,
          codecRef: { codecId: 'pg/bool@1' },
        }),
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
