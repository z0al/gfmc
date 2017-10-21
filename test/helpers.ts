// Packages
import test from 'ava'

// Ours
import { calculateSpaces } from '../src/helpers'

test('CalculateSpaces', t => {
  t.is(calculateSpaces('    a\ta'), 4)
  t.is(calculateSpaces('  - foo'), 2)
  t.is(calculateSpaces('  \tfoo\tbaz\t\tbim'), 4)
  t.is(calculateSpaces('>\t\tfoo'), 0)
  t.is(calculateSpaces('\tfoo\tbaz\t\tbim'), 4)
  t.is(calculateSpaces('\t\tbar'), 7)
})
