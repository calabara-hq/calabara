import sampleSettings from './sample-settings'
import { renderWithProviders } from '../reducers/setup-store'
import { fireEvent, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import ContestMoreDetails from '../../features/creator-contests/components/contest-live-interface/contest_info/contest-more-details'

const initialState = {
    contest_state: null,
    contest_settings: sampleSettings,
    prompt_data: null,
    durations: [null, null, null],
    progress_ratio: null,
    loading: true
}

describe('contest details render test', () => {
    it('should render contest details', () => {
        renderWithProviders(<ContestMoreDetails />, { preloadedState: { contestState: initialState } })
        expect(screen.getByText(/strategy/i)).toBeInTheDocument()
    })

})