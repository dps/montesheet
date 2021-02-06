import React from "react";
import Section from "./Section";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import SectionHeader from "./SectionHeader";
import Newsletter from "./Newsletter";

function NewsletterSection(props) {
  return (
    <Section
      bgColor={props.bgColor}
      size={props.size}
      bgImage={props.bgImage}
      bgImageOpacity={props.bgImageOpacity}
    >
      <Container>
        <Grid container={true} alignItems="center" justify="center" spacing={4}>
          <Grid item={true} xs={12} md={6}>
            <SectionHeader
              title={props.title}
              subtitle={props.subtitle}
              size={4}
            />
          </Grid>
          <Grid item={true} xs={12} md={6}>
            <Newsletter
              buttonText={props.buttonText}
              buttonColor={props.buttonColor}
              inputPlaceholder={props.inputPlaceholder}
              subscribedMessage={props.subscribedMessage}
            />
          </Grid>
        </Grid>
      </Container>
    </Section>
  );
}

export default NewsletterSection;
