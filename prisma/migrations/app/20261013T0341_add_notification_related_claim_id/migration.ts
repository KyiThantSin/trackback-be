#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/bce48d2ceedcfb380b6e26ae4121e22e8a1d1db1cb58a04c6b304de11f7abcd0/contract';
import endContract from '../../snapshots/bce48d2ceedcfb380b6e26ae4121e22e8a1d1db1cb58a04c6b304de11f7abcd0/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/d5a4c082d22f55a7125263406e028c867f2f521a6ec324961a932347617ed596/contract';
import startContract from '../../snapshots/d5a4c082d22f55a7125263406e028c867f2f521a6ec324961a932347617ed596/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.addColumn({
        schema: 'public',
        table: 'Notification',
        column: col('relatedClaimId', 'character(36)', {
          codecRef: { codecId: 'sql/char@1', typeParams: { length: 36 } },
        }),
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
