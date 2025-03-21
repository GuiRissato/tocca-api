
import { KeyResults } from 'src/key_results/entities/key_result.entity';
import { Objectives } from '../entities/objective.entity';

export interface ObjectiveWithKeyResults extends Objectives {
  key_results: KeyResults[];
}