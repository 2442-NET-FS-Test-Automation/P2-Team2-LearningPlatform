import { mount } from "cypress/react";
import PaginationControls, { PaginationControlsProps } from "../..//src/components/layout/PaginationControls";

describe("PaginationControls - TC-CM-08 button boundaries", () => {
    // Helper to mount with default props
    const mountControls = (props: Partial<PaginationControlsProps> = {}) => {
        const defaultProps: PaginationControlsProps = {
            totalPages: 5,
            currentPage: 1,
            defaultIPP: 9,
            goToPage: cy.spy().as("goToPage"),
            handlePrevious: cy.spy().as("handlePrevious"),
            handleNext: cy.spy().as("handleNext"),
            setItemsPerPage: cy.spy().as("setItemsPerPage"),
        };
        const merged = { ...defaultProps, ...props };
        mount(<PaginationControls {...merged} />);
        // Return the props to access spies
        return merged;
    };

    it('does not render pagination controls when totalPages <= 1', () => {
        mountControls({ totalPages: 1  });
        cy.get("#pagControlsContainer").should("not.exist");
        // The per-page selector should still exist
        cy.get("#PagControlsIPPSelector").should("exist");
    });

    it('disables prev button and enables next when currentPage === 1', () => {
        mountControls();
        cy.get("#PagControlsLeft").should("be.disabled");
        cy.get("#PagControlsRight").should("not.be.disabled");

        // Click next – should call handleNext
        cy.get("#PagControlsRight").click();
        cy.get("@handleNext").should("be.called");

        // Click prev (force) – should NOT call handlePrevious because disabled
        cy.get("#PagControlsLeft").click({ force: true });
        cy.get("@handlePrevious").should("not.be.called");
    });

    it('disables next button and enables prev when currentPage === totalPages', () => {
        mountControls({ currentPage: 5 });

        cy.get("#PagControlsLeft").should("not.be.disabled");
        cy.get("#PagControlsRight").should("be.disabled");

        cy.get("#PagControlsLeft").click();
        cy.get("@handlePrevious").should("be.called");

        cy.get("#PagControlsRight").click({ force: true });
        cy.get("@handleNext").should("not.be.called");
    });

    it('enables both buttons when currentPage is in the middle', () => {
        mountControls({ currentPage: 3 });
        cy.get("#PagControlsLeft").should("not.be.disabled");
        cy.get("#PagControlsRight").should("not.be.disabled");
    });

    it('calls goToPage when a page number button is clicked', () => {
        mountControls();
        cy.get("#PagControlsNumbers button").contains("3").click({ force: true });
        cy.get("@goToPage").should("be.calledWith", 3);
    });

    it('calls setItemsPerPage when dropdown changes', () => {
        mountControls();
        cy.get('select#itemsperpage').select('12');
        cy.get('@setItemsPerPage').should('be.calledWith', 12);
    });

    it("shows the compact indicator on mobile (hidden on desktop)", () => {
        mountControls({ currentPage: 3 });
        cy.get("#PagControlsNumbersCompact").should("exist");
        cy.get("#PagControlsNumbersCompact").should("contain.text", "Page 3 of 5");
    });
});