import sampleSettings from './sample-settings'
import { renderWithProviders } from '../reducers/setup-store'
import { fireEvent, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import ContestMoreDetails from '../../features/creator-contests/components/contest-live-interface/contest_info/contest-more-details'
import { withMarkup } from '../helpers'

const initialState = {
    contest_state: null,
    contest_settings: sampleSettings,
    prompt_data: null,
    durations: [null, null, null],
    progress_ratio: null,
    loading: true
}

describe('contest details render test', () => {
    renderWithProviders(<ContestMoreDetails />, { preloadedState: { contestState: initialState } })
    it('should render contest details', () => {
        expect(screen.getByText(/Voters that accurately choose/i)).toHaveTextContent(/Voters that accurately choose the 1st place submission will split 1000 SHARK/)
    })

})